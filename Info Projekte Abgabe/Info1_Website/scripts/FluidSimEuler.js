//! Everytime we start at something like [i*n+j] where n=numY we start at the components of the array that are designated for the Y-Direcetion.
//! This is necessary since we only use a "1D" Array and want to visualize something in 2D.
//! it maps the two-dimensional indices i,j to the corresponding cell in the 1D-Array

//! In each for-loop we first 'hold' the x-value. Therefore we do not iterate through the array row by row but collumn by collumn.
//! The mapping from a 2D array to a 1D arra therefore uses the column-height numY instead of the row-width numX

//! We treat the boundary rows and columns differently! Therefore all loops are ignoring the first and last row and column!
//! I.e the top and bottom row and the leftmost and rightmost column!
//! These are handled in the applyBoundaryCondition()-Method! This is to accuratly model fluid behaviour at the boundaries. I.e "no slip"-condition


class FluidSimEuler {
    //! Dividing by this.cellSize leads to NaN errors.
    constructor(density, numX, numY, simulationCellSize, viscosity) {
        this.density = density;
        this.viscosity = viscosity;
        this.numXCells = numX + 2;							//Number of Cells in x Direction; +2 for values at the edge
        this.numYCells = numY + 2;							//TODO Make globally available. Number of Cells in y Direction; +2 for values at the edge
        this.numCells = this.numXCells * this.numYCells;			//Total number of cells. necessary to determine size of pressure, velocity etc. fields
        this.cellSize = simulationCellSize;										//Grid Spacing
        this.xVel = new Float64Array(this.numCells);		//Velocity Field in horizontal/X-Direction. Unit: m/s
        this.yVel = new Float64Array(this.numCells);		//Velocity Field in vertical/Y-Directions. Unit: m/s
        this.newXVel = new Float64Array(this.numCells);
        this.newYVel = new Float64Array(this.numCells);
        this.pressureField = new Float64Array(this.numCells);		//Pressure Field
        this.pressureField.fill(0.0);
        this.cellType = new Float64Array(this.numCells);		//Marker for all cells, cellType =0 for walls, cellType =1 for normal cells
        this.smokeField = new Float64Array(this.numCells);		//Smoke/Mist Field  1=white 0=black
        this.newSmokeField = new Float64Array(this.numCells);
        this.smokeField.fill(1.0)								//Start with "smoke value" of 1 everywhere

    }

//!-----------------------------------------New Math Functions--------------------------------
    roundToDecimal(number) {
        number = number.toFixed(5);     //Rounds to 5 decimal places, but returrns number as a string
        number = parseFloat(number);                // convert number back to a float
        return number;
    }


    computeLaplacian(field, i, j) {
        //Compute the laplacian of a 2D VECTOR-FIELD! with second-order central difference method. Atm. vertical and horizontal component must be stored in separate 1D arrays
        //Laplacian of a function f(x,) with a step size/grid spacing of h. Note that a scalar field, like the pressure Field has no laplacian associated with it.
        //Lap_h_f(x,y)=( f(x-h, y) + f(x+h,y) + f(x,y-h) + f(x,y+h) - 4*f(x,y) )/(h*h)
        var n = this.numYCells;
        var laplacian = (field[(i - 1) * n + j] + field[(i + 1) * n + j] + field[i * n + j - 1] + field[i * n + j + 1] - 4 * field[i * n + j]) / (this.cellSize * this.cellSize);
        return laplacian;
    }

    computeDivergence(horizontal, vertical, i, j) { //Computes the divergence of a vectorfield
        //Dividing by any number smaller than 1.0 leads to NaN, overflow. Normalising is therefore ommited here and handeld later.
        var n = this.numYCells;
        var divergenceValue = (horizontal[(i + 1) * n + j] - horizontal[i * n + j] + vertical[i * n + j + 1] - vertical[i * n + j])
        return divergenceValue; //Unit 1/m
    }

    computeGradient(field, i, j) { //compute gradient of a field at the point [i,j] by the forward, finite difference method.
        var n = this.numYCells;
        var gradient = (field[i * n + j] - field[(i + 1) * n + j]) / this.cellSize;
        return gradient;
        //TODO can only handle one field, gradient of yVel and xVel calculated with different cells.
    }


    computeViscousTerm(velocityField, viscosity, i, j) {
        //Compute the effect of the fluids viscosity on the change of its velocity.
        let laplacian = this.computeLaplacian(velocityField, i, j);     //Unit laplacian : (m/s)/m^2 = 1/s
        var viscousTerm = viscosity * laplacian;                       //Unit kinematic viscosity: m^2/s
        return viscousTerm;                                             //Unit viscousTerm: m^2/s^2
    }

    addViscousTerm(dt, viscosity) {
        //Update velocity fields with the changes through viscosity
        var n = this.numYCells;
        for (var i = 1; i < this.numXCells - 1; i++) {
            for (var j = 1; j < this.numYCells - 1; j++) {
                var index = i * n + j;

                if (this.cellType[i * n + j] != 0.0 && this.cellType[(i - 1) * n + j] != 0.0 && j < this.numYCells - 1) {              //check for obstacles and walls
                    var viscousTermX = this.computeViscousTerm(this.xVel, viscosity, i, j);
                    this.xVel[index] += dt * viscousTermX;                                                                              // dt * viscousTerm converts to velocity

                    var viscousTermY = this.computeViscousTerm(this.yVel, viscosity, i, j);
                    this.yVel[index] += dt * viscousTermY;
                }
            }
        }
    }

    computePressureTerm(i, j, isHorizontal, dt) {
        //compute the influence of the pressure gradient on the velocity field by a forward finite difference method.
        //Units of the gradient: Pa/m or Pa/pixel
        //Units of the pressureTerm: (Pa/m) / (kg/m^3 * m) = m/s^2
        var n = this.numYCells;

        if (isHorizontal) { //Compute horizontal pressure term
            // Divide by cellSize to normalize pressure Gradient, so that it is independent of the cellSize. Now in units of Pa/m oder Pa/pixel
            var pressureGradient = (this.pressureField[i * n + j] - this.pressureField[(i + 1) * n + j]) / this.cellSize;
            //Note: [(i + 1) * n + j] is right of [i * n + j]
        } else { //Compute vertical pressure term
            var pressureGradient = (this.pressureField[i * n + j] - this.pressureField[i * n + (j + 1)]) / this.cellSize;
            //Note: [i * n + (j + 1)] is visually "below" [i * n + j]. Note that the y-direction of the grid points downwards
        }
        var pressureTerm = pressureGradient * dt / (this.density * this.cellSize);     //convert to acceleration
        return pressureTerm;
    }

    addPressureTerm(dt) {//Update velocity fields with the changes through the pressure gradient
        var n = this.numYCells;
        for (let i = 1; i < this.numXCells; i++) {
            for (let j = 1; j < this.numYCells; j++) {
                var index = i * n + j;
                if (this.cellType[i * n + j] != 0.0 && this.cellType[(i - 1) * n + j] != 0.0 && j < this.numYCells - 1) {              //check for obstacles and walls
                    var pressureTermX = this.computePressureTerm(i, j, true);
                    this.newXVel[index] = dt * pressureTermX;                                                                          // *dt to convert to velocity

                    var pressureTermY = this.computePressureTerm(i, j, false);
                    this.newYVel[index] = dt * pressureTermY;
                }
            }
            this.xVel[index] += this.newXVel[index];
            this.yVel[index] += this.newYVel[index];
        }
    }

    solvePressureField(pressureField, xVel, yVel, dt) {
        //TODO add static pressure
        var n = this.numYCells;
        var diffusionCoefficient = -dt / (this.density * this.cellSize * this.cellSize);  // Measures how 'easily' a fluid diffuses rate of change of pressure due to the diffusion of the fluid. Related to but different from the diffusionRate.
        var beta = 4.0;                                                  // Coefficient to more heavily weigh the adjacentPressureSum, for stability and convergence reasons.
        var staticPressure = densityValue * this.cellSize / dt;

        for (var i = 1; i < this.numXCells - 1; i++) {
            for (var j = 1; j < this.numYCells - 1; j++) {
                var index = i * n + j;
                var div = this.computeDivergence(xVel, yVel, i, j);

                var cellType_x0 = this.cellType[(i - 1) * n + j];
                var cellType_x1 = this.cellType[(i + 1) * n + j];
                var cellType_y0 = this.cellType[i * n + j - 1];
                var cellType_y1 = this.cellType[i * n + j + 1];
                var numberFreeEdges = cellType_x0 + cellType_x1 + cellType_y0 + cellType_y1;		                            // sum up all values of cellType. This equals the Number of edges that are NOT walls.
                if (numberFreeEdges == 0.0 || this.cellType[index] == 0.0)						// If the cell itself or all surrounding cells ar walls
                {
                    continue;
                }

                var scaledDivergence = diffusionCoefficient * div; //Determines influence of the divergence on the pressure field (right hand sight of the poisson equation)
                var adjacentPressureSum = pressureField[(i - 1) * n + j] + pressureField[(i + 1) * n + j] + pressureField[i * n + (j - 1)] + pressureField[i * n + (j + 1)]; //Sum up all surrounding pressure values

                var newPressure = ((scaledDivergence + beta * adjacentPressureSum) / (beta * numberFreeEdges)) + staticPressure;
                pressureField[index] = newPressure;        //Set the newPressure at the index.
            }
        }
    }

    newforceIncompressibility(numIters, dt, viscosity) {
        //Multiple iterations through all cells
        var n = this.numYCells;
        var densityValue = densitySlider.value;
        var staticPressure = densityValue * this.cellSize / dt;           //current static pressure
        var diffusionRate = viscosity * dt / (this.cellSize * this.cellSize);       //Rate or 'speed' at which the fluid diffuses. Related to but different from the diffusionCoefficient.

        for (var iter = 0; iter < numIters; iter++) {    //Multiple iterations
            for (var i = 1; i < this.numXCells - 1; i++) {		// Go through all Cells
                for (var j = 1; j < this.numYCells - 1; j++) {
                    var index = i * n + j;
                    //TODO is there a way to convert index to [(i - 1) * n + j] , [(i + 1) * n + j] and keep it readable? Research.

                    if (this.cellType[index] === 0.0) {		// If there is a wall at s[i*n+j] go to the next cell
                        continue;
                    }

                    var cellType_x0 = this.cellType[(i - 1) * n + j];
                    var cellType_x1 = this.cellType[(i + 1) * n + j];
                    var cellType_y0 = this.cellType[i * n + j - 1];
                    var cellType_y1 = this.cellType[i * n + j + 1];
                    var numberFreeEdges = cellType_x0 + cellType_x1 + cellType_y0 + cellType_y1;		// sum up all values of s.  This s then equals the Number of edges that are NOT walls.
                    if (numberFreeEdges === 0.0) {				// If alle cells are walls, go to the next cell
                        continue;
                    }
                    var div = this.computeDivergence(this.xVel, this.yVel, i, j);
                    var relativeDivergence = -div / numberFreeEdges;					// Equal part through each adjacent cells
                    relativeDivergence *= scene.overRelaxation;                                 // Scale up by overRelaxationFactor for convergence reasons
                    this.pressureField[i * n + j] += staticPressure * relativeDivergence;

                    var laplacianX = this.computeLaplacian(this.xVel, i, j);
                    var laplacianY = this.computeLaplacian(this.yVel, i, j);


                    // Diffusion term added for viscosity
                    this.xVel[i * n + j] += diffusionRate * laplacianX - cellType_x0 * relativeDivergence;
                    this.xVel[(i + 1) * n + j] += diffusionRate * laplacianX + cellType_x1 * relativeDivergence;
                    this.yVel[i * n + j] += diffusionRate * laplacianY - cellType_y0 * relativeDivergence;
                    this.yVel[i * n + j + 1] += diffusionRate * laplacianY + cellType_y1 * relativeDivergence;

                }
            }
        }
    }


//!--------------------------------------End Of New Math Functions----------------------------


    addGravity(dt, gravity)                              //adds gravity to v-component (vertical/Y) of all cells, updates vertical velocity
    {
        var n = this.numYCells;
        for (var i = 1; i < this.numXCells; i++) {			//go through all X-Cells (rows)
            for (var j = 1; j < this.numYCells - 1; j++) {		//go through all Y-Cells (collumns) in that row
                if (this.cellType[i * n + j] != 0.0 && this.cellType[i * n + j - 1] != 0.0)		//adds gravity if current and next cell are not walls (s!=0.0)
                    this.yVel[i * n + j] += gravity * dt;
            }
        }
    }


    //? Better Version than three for-loops possible?
    forceIncompressibility(numIters, dt) {
        //Solves poisson equation and secures incompressible behaviour
        //TODO: Move solving of poisson-equation to its own function. Multiple iterations through all cells
        var n = this.numYCells;
        var currentPressure = densityValue * this.cellSize / dt;			// current static pressure

        for (var iter = 0; iter < numIters; iter++) {    //Multiple iterations
            for (var i = 1; i < this.numXCells - 1; i++) {		// Go through all Cells
                for (var j = 1; j < this.numYCells - 1; j++) {

                    if (this.cellType[i * n + j] == 0.0)			// If there is a wall at s[i*n+j] go to the next cell
                    {
                        continue;                            //! continue ends current iteration if reached and starts with the next
                    }                                           //? Doubling with condition if (numberFreeEdges == 0.0) ?


                    //var s = this.s[i * n + j];              //not used
                    var cellType_x0 = this.cellType[(i - 1) * n + j];
                    var cellType_x1 = this.cellType[(i + 1) * n + j];
                    var cellType_y0 = this.cellType[i * n + j - 1];
                    var cellType_y1 = this.cellType[i * n + j + 1];
                    var numberFreeEdges = cellType_x0 + cellType_x1 + cellType_y0 + cellType_y1;		// sum up all values of s.  This s then equals the Number of edges that are NOT walls.
                    if (numberFreeEdges == 0.0)						// If all surroounding cells are walls, go to the next cell. edge case for moving obstacles.
                    {
                        continue;
                    }

                    /*var divergence = this.xVel[(i + 1) * n + j] - this.xVel[i * n + j] +	//Compute current divergence. Total amount of Out-/Inflow of fluid
                        this.yVel[i * n + j + 1] - this.yVel[i * n + j];
                    */
                    var div = this.computeDivergence(this.xVel, this.yVel, i, j);

                    var relativeDivergence = -div / numberFreeEdges;					// Equal part through each adjacent cells
                    relativeDivergence *= scene.overRelaxation;                             // Scale up by overRelaxationFactor for faster convergence
                    this.pressureField[i * n + j] += currentPressure * relativeDivergence;

                    this.xVel[i * n + j] -= cellType_x0 * relativeDivergence;			//Adjust all velocities so that an equal amount of fluid is pushed out of each cell.
                    this.xVel[(i + 1) * n + j] += cellType_x1 * relativeDivergence;	//Divergence then becomes Zero. Necessary for incomressible fluids
                    this.yVel[i * n + j] -= cellType_y0 * relativeDivergence;			// Edges with an associated cellType  of 0 are walls. therefore no fluid can flow through that edge
                    this.yVel[i * n + j + 1] += cellType_y1 * relativeDivergence;
                }
            }
        }
    }

    applyBoundaryCondition() {				//applies the "no slip" boundary condition to the fluid
        var n = this.numYCells;
        for (var i = 0; i < this.numXCells; i++) {
            this.xVel[i * n + 0] = this.xVel[i * n + 1];                             //Copy the values of the second row to the top row
            this.xVel[i * n + this.numYCells - 1] = this.xVel[i * n + this.numYCells - 2];     //Copy the values of the second-to-last row to the bottom row
        }
        for (var j = 0; j < this.numYCells; j++) {
            this.yVel[0 * n + j] = this.yVel[1 * n + j];                             //Copy the values of the second column to the rightmost column
            this.yVel[(this.numXCells - 1) * n + j] = this.yVel[(this.numXCells - 2) * n + j]  //Copy the values of the second-to-last column to the leftmost column
        }
    }

    sampleField(x, y, fieldID) //Gets a sample value at location [x,y] of the given field, by bilinear interpolation. Interpreted as a weighted mean-value.
    {
        var n = this.numYCells;
        var h = this.cellSize;
        var h1 = 1.0 / h;   //Reciprocal of grid spacing h. Used to convert from physical- to grid-coordinates
        var h2 = 0.5 * h;

        x = Math.max(Math.min(x, this.numXCells * h), h);  //Get upper bound for x-coordinates: Math.minx(...), get lower bound for x-coordinates: Math.max(...), ensures x is within valid range.
        y = Math.max(Math.min(y, this.numYCells * h), h);  //Same in Y-Direction


        var dx = 0.0;           //Interpolation distances
        var dy = 0.0;           //Initialize here to make sure it is interpreted as a float to avoid eventual type coercion.

        var field;			//temporary variable the to be sampled field is assigned to

        switch (fieldID) {
            case xVel_FIELD:
                field = this.xVel;
                dy = h2;
                break;
            case yVel_FIELD:
                field = this.yVel;
                dx = h2;
                break;
            case cellType_FIELD:
                field = this.smokeField;
                dx = h2;
                dy = h2;
                break

        }

        var x0 = Math.min(Math.floor((x - dx) * h1), this.numXCells - 1); //Determine left neighbour of cell [x,y]. Flooring to get cell index.
        var x1 = Math.min(x0 + 1, this.numXCells - 1);                    //Determine right neighbour

        var y0 = Math.min(Math.floor((y - dy) * h1), this.numYCells - 1); //Determine lower neighbour
        var y1 = Math.min(y0 + 1, this.numYCells - 1);                    //Determine upper neighbour

        //Calculate bilinear-interpolation weights
        var tx = ((x - dx) - x0 * h) * h1;      //normalized distance lower left corner in x and why direction from point [x,y]
        var ty = ((y - dy) - y0 * h) * h1;

        var sx = 1.0 - tx;                      //normalized distance upper right corner in x and why direction from point [x,y]
        var sy = 1.0 - ty;

        var val;                                //weighted mean of all neighbouring cells of [x,y]
        val = sx * sy * field[x0 * n + y0] +
            tx * sy * field[x1 * n + y0] +
            tx * ty * field[x1 * n + y1] +
            sx * ty * field[x0 * n + y1];

        return val;
    }

    avgXVel(i, j) {			//Weighted-Average all u-components adjacent to the cell [i,j]
        var n = this.numYCells;
        var xVel = (this.xVel[i * n + j - 1] + this.xVel[i * n + j] +
            this.xVel[(i + 1) * n + j - 1] + this.xVel[(i + 1) * n + j]) * 0.25; //Why only right neighbour-cell weighted?
        return xVel;

    }

    avgYVel(i, j) {			//Weighted-Average all v-components adjacent to the cell [i,j]
        var n = this.numYCells;
        var yVel = (this.yVel[(i - 1) * n + j] + this.yVel[i * n + j] +
            this.yVel[(i - 1) * n + j + 1] + this.yVel[i * n + j + 1]) * 0.25;        //Why only upper neighbour cell weighted?
        return yVel;
    }

    advectVelocity(dt) {			//Moves velocity field by a timestep dt to simulate moving particles by Semi-Lagrangian Advection

        this.newXVel.set(this.xVel);
        this.newYVel.set(this.yVel);

        var n = this.numYCells;
        var h = this.cellSize;			//Grid Spacing
        var h2 = 0.5 * h;

        for (var i = 1; i < this.numXCells; i++) {		//Go through all cells
            for (var j = 1; j < this.numYCells; j++) {

                cnt++; //? What for? Debugging?

                // advect u component
                if (this.cellType[i * n + j] != 0.0 && this.cellType[(i - 1) * n + j] != 0.0 && j < this.numYCells - 1) {              //check for obstacles and walls
                    let x = i * h;				                                                                    //Determine current  x-coordinate in terms of the grid
                    let y = j * h + h2;			                                                                    //?Same as x, add half a spaceing. Why an extra half step?
                    let u = this.xVel[i * n + j];	                                                                    //Get u-velocity at [i,j] / current position
                    let v = this.avgYVel(i, j);	                                                                    //Average v-velocity around [i,j] / current position
                    //var v = this.sampleField(x,y, V_FIELD); Option: sample instead of average
                    x = x - dt * u;				                                                                    //Determine previous position of the velocity currently stored in [i,j] /current position
                    y = y - dt * v;
                    u = this.sampleField(x, y, xVel_FIELD);		                                                    //Sample field at the previous position
                    this.newXVel[i * n + j] = u;					                                                    //Set new value of the u-field at the current position [i,j] to the value it had in
                }                                                                                                   //the cell where that velocity it "came from". Store this in a separate field.
                                                                                                                    // I.e: calculate new velocity fieldHow

                // same as above for v-component
                if (this.cellType[i * n + j] != 0.0 && this.cellType[i * n + j - 1] != 0.0 && i < this.numXCells - 1) {
                    let x = i * h + h2;
                    let y = j * h;
                    var v = this.yVel[i * n + j];
                    let u = this.avgXVel(i, j);
                    // var u = this.sampleField(x,y, U_FIELD); Option: sample instead of average, worse performance?
                    x = x - dt * u;
                    y = y - dt * v;
                    v = this.sampleField(x, y, yVel_FIELD);
                    this.newYVel[i * n + j] = v;
                }
            }
        }

        this.xVel.set(this.newXVel);      //Update the old velocity fields.
        this.yVel.set(this.newYVel);
    }

    advectSmoke(dt) { //Same logic as in advectVel

        this.newSmokeField.set(this.smokeField);

        var n = this.numYCells;
        var h = this.cellSize;
        var h2 = 0.5 * h;

        for (var i = 1; i < this.numXCells - 1; i++) //Go through all cells
        {
            for (var j = 1; j < this.numYCells - 1; j++) {

                if (this.cellType[i * n + j] != 0.0)  //if the cell is not a wall
                {
                    var u = (this.xVel[i * n + j] + this.xVel[(i + 1) * n + j]) * 0.5;        //TODO Why half thee value of the cell the cell to the right?
                    var v = (this.yVel[i * n + j] + this.yVel[i * n + j + 1]) * 0.5;
                    var x = i * h + h2 - dt * u;                                        //Get indices of previous cell location
                    var y = j * h + h2 - dt * v;

                    this.newSmokeField[i * n + j] = this.sampleField(x, y, cellType_FIELD);             //Advect
                }
            }
        }
        this.smokeField.set(this.newSmokeField);
    }

    // ----------------- end of simulator ------------------------------


    performSimulationStep(dt, gravity, numIters, viscosity) {

        this.addViscousTerm(dt, viscosity);
        this.addGravity(dt, gravity);
        this.solvePressureField(this.pressureField, this.xVel, this.yVel, dt);
        this.addPressureTerm(dt);
        this.pressureField.fill(0.0);				//TODO  Make optional to show why its necessary. Clear pressureField.
        //console.log("Max_Xvel, before incomp.: " + Math.max(...this.xVel));
        this.forceIncompressibility(numIters, dt);
        //this.newforceIncompressibility(numIters, dt, viscosity);  //Remove comments two switch between function implementations. newforceIncompressibility() currently not working correctly.
        //console.log("Max_Xvel, after incomp.: " + Math.max(...this.xVel));

        this.applyBoundaryCondition();
        this.advectVelocity(dt);
        this.advectSmoke(dt);
        this.newXVel.fill(0.0);
        this.newYVel.fill(0.0);
        this.calculateFieldStats("Pressure", this.pressureField, scene.frameNr);
        this.calculateFieldStats("X-Velocity", this.xVel, scene.frameNr);
        this.calculateFieldStats("Y-Velocity", this.yVel, scene.frameNr);
    }


// Method to calculate statistics (max, min, avg) and their coordinates for any given field
    calculateFieldStats(fieldName, field, frameNumber) {
        let max = Math.max(...field);
        let min = Math.min(...field);
        let sum = field.reduce((acc, curr) => acc + curr, 0);
        let avg = sum / field.length;

        // Find the index of the cell with the maximum value
        let maxIndex = field.indexOf(max);
        let maxRowIndex = Math.floor(maxIndex / this.numXCells);
        let maxColIndex = maxIndex % this.numXCells;

        // Find the index of the cell with the minimum value
        let minIndex = field.indexOf(min);
        let minRowIndex = Math.floor(minIndex / this.numXCells);
        let minColIndex = minIndex % this.numXCells;


        // Print statistics

        console.log(`max,${max},${frameNumber},${maxColIndex},${maxRowIndex},${fieldName}`);
        console.log(`min,${min},${frameNumber},${minColIndex},${minRowIndex},${fieldName}`);
        console.log(`avg,${avg},${frameNumber},'NAN', NAN', ${fieldName}`);
    }



}