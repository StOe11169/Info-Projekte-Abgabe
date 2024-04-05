var canvas = document.getElementById("eulerCanvas");                         //Opens 2D Canvas API
var canvas2DContext = canvas.getContext("2d");
canvas.width = window.innerWidth - 20;          //TODO Make changeable
canvas.height = window.innerHeight - 100;      //TODO Make changeable
//TODO Stays small when you start in a small window. Influences fluid speed. window.innerWidth is browser specific/current window

canvas.focus();                                 // Focused element receives keyboard and similar events by default

var simHeight = 1.1;                        //TODO Make changeable
var canvasScale = canvas.height / simHeight;		// Scale/extent of the canvas
var simWidth = canvas.width / canvasScale;

var xVel_FIELD = 0;		//"IDs" to differentiate the diffrent fields
var yVel_FIELD = 1;
var cellType_FIELD = 2;

var cnt = 0;
var densitySlider = document.getElementById("densitySlider");
var densityValue = 1000;

densitySlider.oninput = function () {
    densityValue = densitySlider.value;
    console.log(densityValue - densitySlider.value);
}

var viscositySlider = document.getElementById("viscositySlider");
var viscosityValue = 0.0000001;

viscositySlider.oninput = function () {
    viscosityValue = viscositySlider.value
}


function simToCanvasX(x) {		//converts simulation coordinates into canvas coordinates
    return x * canvasScale;
}

function simToCanvasY(y) {		//converts simulation coordinates into canvas coordinates
    return canvas.height - y * canvasScale;
}


var scene =			                            //TODO Make this into diffrent functions/options, first 1 example then in database
    {
        gravity: -9.81,			                //TODO Make Changeable and part of FluidSimEuler
        dt: 1.0 / 100.0,		                //TODO Make Changeable to show its effects on simulation collapse. Make port of FluidSimEuler
        numIters: 100,
        frameNr: 0,
        overRelaxation: 1.9,		            //TODO Make Changeable and part of FluidSimEuler
        obstacleX: 0.0,                         //initial Obstacle Position
        obstacleY: 0.0,
        obstacleRadius: 0.15,			        //TODO Add different obstacles
        paused: false,				            //TODO Add Pause Button
        sceneNr: 0,
        showObstacle: false,		            //TODO Add Show/Hide Button
        showStreamlines: false,
        showVelocities: false,
        showPressure: false,
        showSmoke: true,
        fluidSim: null

    };

function setupScene(sceneNr = 0)		//Always start with sceneNr = 0 aka Default-Start
{
    scene.sceneNr = sceneNr;
    scene.obstacleRadius = 0.15;	//TODO Make Changeable
    scene.overRelaxation = 1.9;		//TODO Make changeable


    var res = 100;					//Resolution

    //Establish simulation space
    var domainHeight = 1.0;										    //TODO Make changeable. Simulation height in simulation space units. Independent of physical units
    var domainWidth = domainHeight / simHeight * simWidth;              //Simulation width in simulation space units. Independent of physical units
    var setupCellSize = domainHeight / res;

    var numX = Math.floor(domainWidth / setupCellSize);						    //TODO Make changeable
    var numY = Math.floor(domainHeight / setupCellSize);					    //TODO Make changeable

    var density = densityValue;										//TODO Make changeable
    var viscosity = viscosityValue;                                    //TODO Make changeable


    fluidSimSetup = scene.fluidSim = new FluidSimEuler(density, numX, numY, setupCellSize, viscosity);		    //Scene starts without a fluid, give it one
    var n = fluidSimSetup.numYCells;


    //Go through all cells
    if (sceneNr == 0) {   		// tank

        for (var i = 0; i < fluidSimSetup.numXCells; i++) {
            for (var j = 0; j < fluidSimSetup.numYCells; j++) {
                var cellType = 1.0;
                if (i == 0 || i == fluidSimSetup.numXCells - 1 || j == 0)	        //Mark bottom and edges as solid
                {
                    cellType = 0.0;
                }
                fluidSimSetup.cellType[i * n + j] = cellType                    //Mark everything else as fluid
            }
        }

        scene.gravity = -9.81; //TODO make part of simulator-class and changeable
        scene.showPressure = true;
        scene.showSmoke = false;
        scene.showStreamlines = false;
        scene.showVelocities = false;
    }
    else if (sceneNr == 1 || sceneNr == 3) // vortex shedding
    {
        var inVel = 2.0;									//TODO make changeable, initial Velocity
        for (var i = 0; i < fluidSimSetup.numXCells; i++)                    //Go through all cells
        {
            for (var j = 0; j < fluidSimSetup.numYCells; j++) {
                var cellType = 1.0;
                if (i == 0 || j == 0 || j == fluidSimSetup.numYCells - 1)	//Mark edges and bottom as solid
                {
                    cellType = 0.0;	// solid
                }
                fluidSimSetup.cellType[i * n + j] = cellType							//Mark everything as fluid
                if (i == 1) {
                    fluidSimSetup.xVel[i * n + j] = inVel;     //Set velocity in the first column to 'inVel'
                }
            }
        }

        var pipeH = 0.1 * fluidSimSetup.numYCells;							      //TODO Make changeable. Diameter of the pipe
        var minJ = Math.floor(0.5 * fluidSimSetup.numYCells - 0.5 * pipeH);   //Starting height of smoke tunnel. Changes position
        var maxJ = Math.floor(0.5 * fluidSimSetup.numYCells + 0.5 * pipeH);   //End height. Make narrower/wider

        for (var j = minJ; j < maxJ; j++)			//Makes smoke in the middle of the lefthand wall
        {                                           //TODO Add second loop, so that it is not only on the wall
            fluidSimSetup.smokeField[j] = 0.0;
        }

        setObstacleCircle(0.4, 0.5, true)                 //Sets initial obstacle position and to visible

        scene.gravity = 0.0;
        scene.showPressure = false;
        scene.showSmoke = true;
        scene.showStreamlines = false;
        scene.showVelocities = false;

        if (sceneNr == 3) {
            scene.dt = 1.0 / 120.0;
            scene.numIters = 100;
            scene.showPressure = true;
        }
//Setup Scene 2, paint simulation
    } else if (sceneNr == 2) {

        scene.gravity = 0.0;         //TODO Make changeable
        scene.overRelaxation = 1.0; //TODO make changeable
        scene.showPressure = false;
        scene.showSmoke = true;
        scene.showStreamlines = false;
        scene.showVelocities = false;
        scene.obstacleRadius = 0.1;
    }

    document.getElementById("streamButton").checked = scene.showStreamlines;
    document.getElementById("velocityButton").checked = scene.showVelocities;
    document.getElementById("pressureButton").checked = scene.showPressure;
    document.getElementById("smokeButton").checked = scene.showSmoke;
    document.getElementById("overrelaxButton").checked = scene.overRelaxation > 1.0;

    simParameters(density, viscosity, scene.dt, res, numX, numY, setupCellSize, scene.overRelaxation);


}


// draw -------------------------------------------------------
//! Reminder "c" is the canvas

function setColor(r, g, b) {
    canvas2DContext.fillStyle = `rgb(
                        ${Math.floor(255 * r)},
                        ${Math.floor(255 * g)},
                        ${Math.floor(255 * b)})`
    canvas2DContext.strokeStyle = `rgb(
                        ${Math.floor(255 * r)},
                        ${Math.floor(255 * g)},
                        ${Math.floor(255 * b)})`
}

function getSciColor(val, minVal, maxVal) {
    val = Math.min(Math.max(val, minVal), maxVal - 0.0001);     //Make sure 'val' is within range of 'minVal' and 'maxVal'. '- 0.0001' makes sure 'num' cant become '4', since we start the cases at '0'
    var diffrenceMinMax = maxVal - minVal;
    val = diffrenceMinMax == 0.0 ? 0.5 : (val - minVal) / diffrenceMinMax;     //If the difference is zero, set 'val = 0.5' (middle), otherwise normalize 'val' (Is now between 0 and 1)
                                                                               //normalizes 'val'. Can be interpreted as its relative position between 'minVal' and 'maxVal' in '%'
    var m = 0.25;
    var num = Math.floor(val / m);                               //NOTE: Math.floor() returns the largest integer less than or equal to a given number.
                                                                            // If 'val' is between [0, <0.25] it gets rounded to 0. [0.25, <0.5] to 1; [0.5, <0.75] to 2; [0.75, <1] to 3
    var saturation = (val - num * m) / m;                          //between zero and 1
    var r, g, b;                                                            //red, green, blue

    switch (num) {
        case 0: //Blues
            r = 0.0;
            g = saturation;
            b = 1.0;
            break;
        case 1: //Cyans
            r = 0.0;
            g = 1.0;
            b = 1.0 - saturation;
            break;
        case 2: //Greens
            r = saturation;
            g = 1.0;
            b = 0.0;
            break;
        case 3: //Yellows
            r = 1.0;
            g = 1.0 - saturation;
            b = 0.0;
            break;
    }

    return [255 * r, 255 * g, 255 * b, 255]                             //RGB value with an alpha value of 255 (last entry in array) / fully opaque
}

//Draws the results from the fluid simulation to the canvas
function draw() {                                                  //TODO Break down into smaler functions?
    canvas2DContext.clearRect(0, 0, canvas.width, canvas.height);  //Start with a blank canvas

    canvas2DContext.fillStyle = "#FF0000";                               //Fill red
    fluidSimDraw = scene.fluidSim;                                       //Take the fluid from the scene
    n = fluidSimDraw.numYCells;                                          //Grid Height
    var cellScale = 1.1;                                        //TODO Make adjustable Scaling factor
    var cellSizeDraw = fluidSimDraw.cellSize;

    minP = fluidSimDraw.pressureField[0];                               //set 'minP' to pressure value of the first cell. To have a starting value to compare
    maxP = fluidSimDraw.pressureField[0];                               //set 'maxP' to pressure value of the first cell.

                                                                        // Initialize variables to store the coordinates of min and max pressure points


    for (var i = 0; i < fluidSimDraw.numCells; i++) {          //Go through each cell. Compare and update 'minP' and 'maxP'
        minP = Math.min(minP, fluidSimDraw.pressureField[i]);
        maxP = Math.max(maxP, fluidSimDraw.pressureField[i]);
    }
    

    canvasImageData = canvas2DContext.getImageData(0, 0, canvas.width, canvas.height)
    var rgb_colorArray = [255, 255, 255, 255]                            //color array far later reference of values

    //Go through all cells
    for (var i = 0; i < fluidSimDraw.numXCells; i++) {
        for (var j = 0; j < fluidSimDraw.numYCells; j++) {

            if (scene.showPressure) {    //If tickbox 'show Pressure' is selected.

                var pressure = fluidSimDraw.pressureField[i * n + j];         //Get pressure Value
                var saturation = fluidSimDraw.smokeField[i * n + j];         //Get value of smokeField, can be interpreted as saturation
                rgb_colorArray = this.getSciColor(pressure, minP, maxP);
                if (scene.showSmoke)                    //? Maybe as ternary operation instead of two 'if-statements'?
                {
                    //adjust colours with saturation at the current point in the field
                    rgb_colorArray[0] = Math.max(0.0, rgb_colorArray[0] - 255 * saturation);
                    rgb_colorArray[1] = Math.max(0.0, rgb_colorArray[1] - 255 * saturation);
                    rgb_colorArray[2] = Math.max(0.0, rgb_colorArray[2] - 255 * saturation);
                }
            } else if (scene.showSmoke) {
                var smokeOpacity = fluidSimDraw.smokeField[i * n + j];     //adjust colours with saturation at the current point in the field
                rgb_colorArray[0] = 255 * smokeOpacity;
                rgb_colorArray[1] = 255 * smokeOpacity;
                rgb_colorArray[2] = 255 * smokeOpacity;
                if (scene.sceneNr == 2) {
                    rgb_colorArray = this.getSciColor(smokeOpacity, 0.0, 1.0);
                }

            }
            //Colour the borders and bostacles black
            else if (fluidSimDraw.cellType[i * n + j] == 0.0) {
                rgb_colorArray[0] = 0;
                rgb_colorArray[1] = 0;
                rgb_colorArray[2] = 0;
            }

            var x = Math.floor(simToCanvasX(i * cellSizeDraw));                      //convert simulation coords to canvas cords
            var y = Math.floor(simToCanvasY((j + 1) * cellSizeDraw));
            var cx = Math.floor(canvasScale * cellScale * cellSizeDraw) + 1;    //Size of the canvas square in x direction. cx = canvas-Y
            var cy = Math.floor(canvasScale * cellScale * cellSizeDraw) + 1;    //same for y
            //TODO better performance with just cy = cx?
            //cellScale and cScale (canvas scale) just as arbitrary scaling factors

            r = rgb_colorArray[0];
            g = rgb_colorArray[1];
            b = rgb_colorArray[2];

            for (var yi = y; yi < y + cy; yi++) {       //go through all y-values
                var p = 4 * (yi * canvas.width + x)     // p = starting index of the current pixel. Multiply by for since every pixel has 4 values. R,G,B and Alpha

                for (var xi = 0; xi < cx; xi++) {       //go through all x-values
                    canvasImageData.data[p++] = r;               //Increment p by one after each. Start at p(red). Then add +1
                    canvasImageData.data[p++] = g;               //Steps to the green value of the current pixel, add +1 to get to blue, and one more to get to alpha
                    canvasImageData.data[p++] = b;
                    canvasImageData.data[p++] = 255;
                }
            }
        }
    }

    canvas2DContext.putImageData(canvasImageData, 0, 0); //Put all the data(pixel values) of the  object id onto the canvas. starting at point [0, 0]

    if (scene.showVelocities) {             //Shows current velocities and their direction
        canvas2DContext.strokeStyle = "#000000";
        scale = 0.02;

        for (var i = 0; i < fluidSimDraw.numXCells; i += 10) {
            for (var j = 0; j < fluidSimDraw.numYCells; j += 10) {

                var xVel = fluidSimDraw.xVel[i * n + j];           //Get current velocities at point [i,j]
                var yVel = fluidSimDraw.yVel[i * n + j];

                //Draw x-velocities
                canvas2DContext.beginPath();
                x0 = simToCanvasX(i * cellSizeDraw);
                x1 = simToCanvasX(i * cellSizeDraw + xVel * scale);
                y = simToCanvasY((j + 0.5) * cellSizeDraw);
                canvas2DContext.moveTo(x0, y);
                canvas2DContext.lineTo(x1, y);
                canvas2DContext.stroke();

                //Draw arrowhead at the end of the x-velocity line
                var arrowSize = 5;
                var angleX = Math.atan2(0, x1 - x0); // Calculate the angle of the line
                canvas2DContext.beginPath();
                canvas2DContext.moveTo(x1, y);
                canvas2DContext.lineTo(
                    x1 - arrowSize * Math.cos(angleX - Math.PI / 6),
                    y - arrowSize * Math.sin(angleX - Math.PI / 6)
                );
                canvas2DContext.moveTo(x1, y);
                canvas2DContext.lineTo(
                    x1 - arrowSize * Math.cos(angleX + Math.PI / 6),
                    y - arrowSize * Math.sin(angleX + Math.PI / 6)
                );
                canvas2DContext.strokeStyle = "#FF0000";
                canvas2DContext.stroke();
                canvas2DContext.closePath();


                //Draw y-velocities
                y0 = simToCanvasY(j * cellSizeDraw);
                y1 = simToCanvasY(j * cellSizeDraw + yVel * scale);
                x = simToCanvasX((i + 0.5) * cellSizeDraw);
                canvas2DContext.beginPath();
                canvas2DContext.moveTo(x, y0);
                canvas2DContext.lineTo(x, y1);
                canvas2DContext.strokeStyle = "#0000FF";
                canvas2DContext.stroke();

                // add arrowhead to the end of the line
                const angleY = Math.atan2(y1 - y0, 0);
                canvas2DContext.lineTo(
                    x - arrowSize * Math.cos(angleY - Math.PI / 6),
                    y1 - arrowSize * Math.sin(angleY - Math.PI / 6)
                );
                canvas2DContext.moveTo(x, y1);
                canvas2DContext.lineTo(
                    x - arrowSize * Math.cos(angleY + Math.PI / 6),
                    y1 - arrowSize * Math.sin(angleY + Math.PI / 6)
                );

                canvas2DContext.stroke();


            }
        }
    }

    if (scene.showStreamlines) {

        var segLen = fluidSimDraw.cellSize * 0.2;  //Segment length? Not used
        var numSegs = 5;         //Iteration length for drawing streamline. The bigger the longer a streamline.
        //Lower means more individual streamlines.
        canvas2DContext.strokeStyle = "#000000";      //Streamline color

        for (var i = 1; i < fluidSimDraw.numXCells - 1; i += 5)         //Start a streamline at every fifth cell
        {                                               //TODO Make step-size changeable / controll streamline density
            for (var j = 1; j < fluidSimDraw.numYCells - 1; j += 5) {

                var x = (i + 0.5) * fluidSimDraw.cellSize;
                var y = (j + 0.5) * fluidSimDraw.cellSize;

                canvas2DContext.beginPath();                          //Clear list of sub-paths and start a new one
                canvas2DContext.moveTo(simToCanvasX(x), simToCanvasY(y));                 //at position [x,y]

                for (var n = 0; n < numSegs; n++) {
                    var u = fluidSimDraw.sampleField(x, y, xVel_FIELD);
                    var v = fluidSimDraw.sampleField(x, y, yVel_FIELD);
                    var l = Math.sqrt(u * u + v * v);
                    // x += u/l * segLen;
                    // y += v/l * segLen;
                    x += u * 0.01;                      //Move coordinate along with a time step of 0.01
                    y += v * 0.01;                      //TODO Make consistent with general timestep
                    if (x > fluidSimDraw.numXCells * fluidSimDraw.cellSize) {             //Stop if out of bounce
                        break;
                    }
                    canvas2DContext.lineTo(simToCanvasX(x), simToCanvasY(y));             //take the new position as endpoint of the line
                }
                canvas2DContext.stroke();                             //Actually draw the line on the canvas
            }
        }
    }

    if (scene.showObstacle) {               //Adjusts obstacle size depending on the grid spacing
        radius = scene.obstacleRadius + fluidSimDraw.cellSize;     //Grid spacing dependent on browser size
        if (scene.showPressure) {
            canvas2DContext.fillStyle = "#000000";        //Set fill colour to black if 'show Pressure' is selected
        } else {
            canvas2DContext.fillStyle = "#DDDDDD";        //Else make light gray
        }

        //Draws two half circles and combines them to a circle

        canvas2DContext.beginPath();
        canvas2DContext.arc(simToCanvasX(scene.obstacleX), simToCanvasY(scene.obstacleY), canvasScale * radius, 0.0, 2.0 * Math.PI);
        canvas2DContext.closePath();
        canvas2DContext.fill();


        canvas2DContext.lineWidth = 3.0; //!Unnecessary
        canvas2DContext.strokeStyle = "#000000";          //! Make a black edge. cool
        canvas2DContext.beginPath();
        canvas2DContext.arc(simToCanvasX(scene.obstacleX), simToCanvasY(scene.obstacleY), canvasScale * radius, 0.0, 2.0 * Math.PI);
        canvas2DContext.closePath();
        canvas2DContext.stroke();
        canvas2DContext.lineWidth = 1.0;  //!Unnecessary

        canvas2DContext.pat
    }


    //Display current min and max Pressure at the top left
    //TODO Unecessary in this way. always show pressure instead
    if (scene.showPressure) {
        var displayPressureString = "pressure: " + minP.toFixed(0) + " - " + maxP.toFixed(0) + " N/m";
        canvas2DContext.fillStyle = "#000000";
        canvas2DContext.font = "16px Arial";
        canvas2DContext.fillText(displayPressureString, 10, 35);
    }
}

//-----------------------end of draw function ----------------------------------------
function setObstacleCircle(x, y, reset) {
    //x and y = center position of the obstacle

    //! What causes a reset?
    var obstacleVelX = 0.0;                       //initial Object velocities
    var obstacleVelY = 0.0;

    if (!reset) {                       //Calculate object velocity
        obstacleVelX = (x - scene.obstacleX) / scene.dt;
        obstacleVelY = (y - scene.obstacleY) / scene.dt;
    }

    scene.obstacleX = x;                //Get current position
    scene.obstacleY = y;
    var r = scene.obstacleRadius;
    var fluidSimSetObstacle = scene.fluidSim;
    var n = fluidSimSetObstacle.numYCells;
    var cd = Math.sqrt(2) * fluidSimSetObstacle.cellSize;  //!Never used. Length of the diagonal of a cell

    for (var i = 1; i < fluidSimSetObstacle.numXCells - 2; i++)        //Go through all cells
    {
        for (var j = 1; j < fluidSimSetObstacle.numYCells - 2; j++) {

            fluidSimSetObstacle.cellType[i * n + j] = 1.0;               //Mark every cell as fluid
            dx = (i + 0.5) * fluidSimSetObstacle.cellSize - x;           //Diffrence between center point of current cell and point x,y (obstacles center)
            dy = (j + 0.5) * fluidSimSetObstacle.cellSize - y;
            //! Currently only works for circles
            if (dx * dx + dy * dy < r * r) {        // if the cell is within the outline of the circle
                fluidSimSetObstacle.cellType[i * n + j] = 0.0;               //mark it as solid
                if (scene.sceneNr == 2) {
                    fluidSimSetObstacle.smokeField[i * n + j] = 0.5 + 0.5 * Math.sin(0.1 * scene.frameNr)  //Vary smoke opacity if the current cell is solid.
                }                                                               //This visualizes the dispersing of the the smoke, when it hits an object
                else {
                    fluidSimSetObstacle.smokeField[i * n + j] = 1.0;
                }
                //Set the value of the velocity field to the speed of the obstacle, when it is within the outline of the obstacle
                fluidSimSetObstacle.xVel[i * n + j] = obstacleVelX;
                fluidSimSetObstacle.xVel[i * n + j] = obstacleVelX;
                fluidSimSetObstacle.xVel[(i + 1) * n + j] = obstacleVelX;
                fluidSimSetObstacle.yVel[i * n + j] = obstacleVelY;
                fluidSimSetObstacle.yVel[i * n + j + 1] = obstacleVelY;
            }
        }
    }

    scene.showObstacle = true;
}


// interaction -------------------------------------------------------

var mouseDown = false;

function startDrag(x, y) {
    let bounds = canvas.getBoundingClientRect(); //Gets size and position of the canvas in current viewport

    let mx = x - bounds.left - canvas.clientLeft;  //convert cursor position from viewport to canvas coordinates
    let my = y - bounds.top - canvas.clientTop;
    mouseDown = true;

    x = mx / canvasScale;                                //
    y = (canvas.height - my) / canvasScale;

    setObstacleCircle(x, y, true);                        //set obstacle to updated position
}

function drag(x, y) {
    if (mouseDown) {
        let bounds = canvas.getBoundingClientRect();
        let mx = x - bounds.left - canvas.clientLeft;
        let my = y - bounds.top - canvas.clientTop;
        x = mx / canvasScale;
        y = (canvas.height - my) / canvasScale;
        setObstacleCircle(x, y, false);
    }
}

function endDrag() {
    mouseDown = false;
}

canvas.addEventListener('mousedown', event => {     //If mouse button ist pressed, call startDrag
    startDrag(event.x, event.y);                    //passes the coordinates where the event occured
});

canvas.addEventListener('mouseup', event => {       //If mouse button is lifted, call endDrag
    endDrag();
});

canvas.addEventListener('mousemove', event => {     //If cursor is moved, call drag
    drag(event.x, event.y);
});

canvas.addEventListener('touchstart', event => {
    startDrag(event.touches[0].clientX, event.touches[0].clientY)
});

canvas.addEventListener('touchend', event => {
    endDrag()
});

canvas.addEventListener('touchmove', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    drag(event.touches[0].clientX, event.touches[0].clientY)
}, {passive: false});


document.addEventListener('keydown', event => {     //TODo make more visable, mabye add buttons
    switch (event.key) {
        case 'p':                           //Stops simulation
            scene.paused = !scene.paused;
            break;
        case 'm':                           //Moves simulation forward by one frame
            scene.paused = false;
            updateSimulation();
            scene.paused = true;
            break;     //Frame by frame
    }
});



// Event listener for the step button
document.getElementById('stepButtonEuler').addEventListener('click', stepSimulation);

// Event listener for the start/stop button
document.getElementById('startStopButtonEuler').addEventListener('click', toggleStart);



//Pauses scene and changes the button text and image, when pressed
//TODO: Text changes work, but image source doesn't change
function toggleStart()
{
    console.log("toggleStart clicked")
    let button = document.getElementById('startStopButtonEuler');
    let img = document.querySelector('#startStopButtonEuler img');

    if (scene.paused){
        button.innerHTML = "Stop";
        img.src ='images/svg/pause-btn.svg';
    }
    else {
        button.innerHTML = "Start";
        scene.paused = !scene.paused;
        img.src = 'images/svg/play-btn.svg';
    }
}




// Function to step simulation forward by one frame
function stepSimulation() {
    scene.paused = false;
    updateSimulation();
    scene.paused = true;
}

// main -------------------------------------------------------

function updateSimulation() {
    if (!scene.paused)
        scene.fluidSim.performSimulationStep(scene.dt, scene.gravity, scene.numIters, scene.fluidSim.viscosity)
    scene.frameNr++;
}

function runSimulationLoop() {     //infinite loop
    updateSimulation();
    draw();
    //setTimeout(draw(), 5000);
    requestAnimationFrame(runSimulationLoop); //calls runSimulationLoop again, which calls requestAnimationFrame again
}

function simParameters (density, viscosity, dt, res, numX, numY, setupCellSize, overRelaxation) {
    console.log("numXCells", numX);
    console.log("numYCells", numY);
    console.log("Timestep", dt);
    console.log("Res", res);
    console.log("cell size", setupCellSize);
    console.log("OR", overRelaxation);
    console.log("dens", density);
    console.log("vis", viscosity);
}
