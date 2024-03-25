<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FLIP Fluid</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/sidebar.css">
    <link href="styles/simulator.css" rel="stylesheet">
    <link rel="stylesheet" href="styles/breadcrumbs.css">


</head>
<body>

<div class="page-wrapper">

    <div class="header-wrapper">

        <?php include('elements/navbar.php') ?>

        <nav aria-label="breadcrumb">
            <ol class="breadcrumb breadcrumb-chevron p-3 bg-body-tertiary rounded-3">
                <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                <li class="breadcrumb-item"><a href="simSelect.php">Simulators</a> </li>
                <li class="breadcrumb-item"><a>FLIP Simulator</a></li>
            </ol>
        </nav>

    </div>

    <div class="main-wrapper">

        <!-- Sidebar Navigation-->

        <div class="sidenav-wrapper">
            
        </div>


        <!------Main Page Content -->
        <div class="center-wrapper">



            <div class="simulator-wrapper">

                <div class="controlPanel btn-group" role="group">
                    <input type = "checkbox" class="btn-check" id="showParticlesButton" checked  onclick = "scene.showParticles = !scene.showParticles">
                    <label for="showParticlesButton" class="btn btn-primary checkbox-label">Show Particles </label>


                    <input type = "checkbox" class="btn-check" id="showGridButton" onclick = "scene.showGrid = !scene.showGrid">
                    <label for="showGridButton" class="btn btn btn-primary checkbox-label">Show Grid</label>



                    <input type = "checkbox" class="btn-check" id="compensateDriftButton" checked onclick = "scene.compensateDrift = !scene.compensateDrift">
                    <label for="compensateDriftButton" class="btn btn btn-primary checkbox-label">Compensate Drift </label>

                    <input type = "checkbox" class="btn-check" id="separateParticlesButton" checked onclick = "scene.separateParticles = !scene.separateParticles">
                    <label for="separateParticlesButton" class="btn btn btn-primary checkbox-label">Separate Particles</label>


                    <div class="slider-div">
                        <label class="form-label" for="picFLIPSlider">PIC:</label>
                        <label class="form-label" for="picFLIPSlider" style="padding-left: 1vw" >FLIP:</label>
                        <input type = "range" class="slider form-range" min = "0" max = "10" value = "9" class = "slider" onchange="scene.flipRatio = 0.1 * this.value">
                    </div>


                    <button class="button btn btn-primary" id="stepButtonFLIP" data-bs-toggle="button" aria-pressed="false" autocomplete="off">Step</button>
                    <button class="button btn btn-primary" id="startStopButtonFLIP" data-bs-toggle="button" aria-pressed="false" autocomplete="off"> Stop <img src="images/svg/pause-btn.svg"></button>
                    <button class="button btn btn-primary" id="saveButtonFLIP" data-bs-toggle="button" aria-pressed="false" autocomplete="off" disabled> Save Results</button>


                </div>

                <div>
                    <canvas id="FLIPCanvas" style="border:2px solid"></canvas>
                    <script src="scripts/FluidSimFLIP.js"> </script>
                    <script>
                        setupScene();
                        update();
                    </script>
                </div>



            </div>


        </div>

        <!--Righthand spacer to align Page content -->
        <div class="right-hand-buffer">

        </div>

    </div>

    <div class="footer-wrapper">
        <?php $referenceLink = "https://matthias-research.github.io/pages/tenMinutePhysics/index.html";?>
        <?php include('elements/footer.php') ?>
    </div>

</div>

<script src="scripts/main.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>

</body>
</html>

