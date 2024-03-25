<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>About</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/breadcrumbs.css">


</head>
<body>

<div class="page-wrapper">

    <div class="header-wrapper">

        <?php include('elements/navbar.php') ?>

        <nav aria-label="breadcrumb">
            <ol class="breadcrumb breadcrumb-chevron p-3 bg-body-tertiary rounded-3">
                <li class="breadcrumb-item">
                    <a href="index.php">Home</a>
                </li>
                <li class="breadcrumb-item">
                    <a>About</a>
                </li>
            </ol>
        </nav>



    </div>

    <div class="main-wrapper">

        <!-- Sidebar Navigation-->
        <div class="sidenav-wrapper">


        </div>

        <!------Main Page Content -->
        <div class="center-wrapper">
            <h1>Disclaimer </h1>
            <p>This website was created as part of a course project and is intended for educational purposes.
                It is still a work in progress and may contain incomplete features, bugs, or inaccuracies. <br>
                The content provided on this website is for demonstration and learning purposes only and should not be considered authoritative or relied upon for any purpose.
            </p>

            <h4> Purpose and Goals of this Website</h4>
            <p> This website aims to be an educational tool and a resource hub for information about Computational Fluid Dynamics and numerical Mathematics for engineering purposes.
                By hosting and explaining comparatively simple simulation programs right on the website, we hope to demonstrate an intuitive way on how one might approach problems and topics from this field.
            </p>

            <h2>To-Do-List:</h2>
            <h6>To-Do:Content</h6>
            <p>
                <ul>
                <li>Fill Glossary</li>
                <li>Rework Tutorials to use Jupyter Notebooks</li>
                <li>Add more simulators
                    <ul style="list-style-type: square;margin-left: 2em">
                        <li>Add simulators with different approaches</li>
                        <li>Add more simplistic variants of simulators</li>
                    </ul>
                </li>
            </ul>
            </p>
            <h6>To-Do:Website</h6>
            <p>
                <ul>
                <li>Add localisation</li>
                <li>Rework Structure</li>
                <li>Implement active-link highlighting</li>
                <li>Add database connection (MySQL)</li>
                <li>Move to provider or setup local XAMPP-Server</li>
            </ul>
            </p>
            <h6>To-Do:Simulators</h6>
            <p>
            <ul>
                <li>Update and expand GUI in general</li>
                <li>Implement Save button and hook up database</li>
                <li>Add fluid selection in addition to sliders.
                    <ul style="list-style-type: square;margin-left: 2em">
                        <li>Sliders default to selected values of chosen fluid</li>
                        <li>Add reset button</li>
                        <li>Research: How to display changing viscosity and density in results/database? </li>
                    </ul>
                </li>
                <li>Add Show/Hide Button	showObstacle: false,</li>
                <li>Make Changeable	scene.obstacleRadius = 0.15;</li>
                <li>Make changeable	scene.overRelaxation = 1.9;</li>
                <li>Text changes work, but image source doesn't change</li>
                <li>Sliding obstacle over source "blocks" it, moving obstacle into source does not.</li>
                <li>Change all finite difference methods to central difference method</li>
                <li>Maybe make difference methods modular</li>
                <li>Decouple render speed from canvas size</li>
                <li>/Add method to control and compare different numerical methods</li>
                <li>Let canvas size vary but sim size stays same, only visually stretched</li>
                <li>Add 3D-Version with WebGl or p5.js</li>
                <li>decouple simulation speed from rendering speed</li>
                <li>Add dimensions to all physical units</li>
                <li>Make number of cells independent of sim cell size</li>
                <li>computeGradient can only handle one field at a tim => gradient of yVel and xVel calculated with different cells.</li>
                <li>Add static pressure</li>
                <li>Move solving of poisson-equation to its own function. Multiple iterations through all cells</li>
                <li>Make optional (430, 44) this.pressureField.fill(0.0); to show why its necessary. Clear pressureField.</li>
                <li>Canvas stays small when you start in a small window. Influences fluid speed. window.innerWidth is browser specific/current window</li>
                <li>Make (45, 45) gravity: -9.81, Changeable and part of FluidSimEuler</li>
                <li>Make the timestep (46, 45) dt: 1.0 / 100.0, Changeable to show its effects on simulation collapse.</li>
                <li>Make overRelaxation Changeable and part of FluidSimEuler-Class</li>
                <li>Add different obstacles</li>
                <li>Tie starting value to database: densitiy</li>
                <li>Tie starting value to database: viscosity</li>
                <li>Make part of simulator-class and changeable scene.gravity = -9.81;</li>
                <li>Make changeable, initial Velocity</li>
                <li>Make changeable. Diameter of the pipe</li>
                <li>Break down function draw() into smaler functions</li>
                <li>Make step-size changeable / controll streamline density</li>
                <li>Separate FLIP-visualisation from simulator code</li>
                <li>Unify Simulator Visualisation</li>
            </ul>

            </p>
        </div>

        <!--Righthand spacer to align Page content -->
        <div class="right-hand-buffer">

        </div>

    </div>

    <div class="footer-wrapper">
        <?php include('elements/footer.php') ?>
    </div>

</div>

<script src="scripts/main.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>

</body>
</html>

