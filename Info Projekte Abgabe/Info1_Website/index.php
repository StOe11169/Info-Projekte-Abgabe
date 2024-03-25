<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Index</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/breadcrumbs.css">
    <script>
        alert("This website is currently a work in progress. Further content will be added in the future! Click 'Ok' to continue. See the 'About' section for more information")

    </script>


</head>
<body>

<div class="page-wrapper">

    <div class="header-wrapper">

        <?php include('elements/navbar.php') ?>

    </div>

    <div class="main-wrapper">

        <!-- Sidebar Navigation-->
        <div class="sidenav-wrapper">
            <!--  <nav class="nav flex-column list-group list-group-flush overflow-auto sidenav">
                  <a href="#home" class="list-group-item list-group-item-action bg-light nav-link nav-item" id="side-nav-home">Home</a>
                  <a href="#section-a" class="list-group-item list-group-item-action bg-light nav-link nav-item side-nav-link" id="side-nav-sec-a">A</a>
                  <a href="#section-b" class="list-group-item list-group-item-action bg-light nav-link nav-item side-nav-link" id="side-nav-sec-b">B</a>
                  <a href="#section-c" class="list-group-item list-group-item-action bg-light nav-link nav-item side-nav-link" id="side-nav-sec-c">C</a>
                  <!-- Add more links for other letters -->
            </nav>

        </div>

        <!------Main Page Content -->
        <div class="center-wrapper">
            <div style="margin-bottom: 1vw; display: flex; justify-content: flex-start; align-items: flex-start;">
                <img src="images/svg/flowLogo.svg" style="width: 10%; height: auto;">
                <img src="images/svg/flowAcronymText.svg" style="width: 10%; height: auto;">
            </div>

            <p style="margin-bottom: 3vh"> <h4>Welcome to F.L.O.W</h4>  An online platform to learn about computational fluid dynamics. <br>
            This page is still a work in progress and has a long way to go, but please select one of the tiles below
            to see the content that's already available.</p>

            <div class="card-wrapper smaller-tiles">
                <a href="simSelect.php" class="card-anchor">
                    <div class="card tile">
                        <div class="card-img-wrapper">
                            <img class="card-img-top" src="images/jpg/pexels-md-sufiyan-3737018.jpg" alt="Card image cap">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title border-bottom"><img src="images/svg/calculator.svg"> Simulators</h5>

                            <p class="card-text">Test out and compare different approaches to CFD directly on this site.
                                You can find more information about the different approaches under
                                the Resources tab.
                                </p>
                        </div>
                    </div>
                </a>

                <a href="resources.php" class="card-anchor">
                    <div class="card tile">
                        <div class="card-img-wrapper">
                            <img class="card-img-top" src="images/jpg/pexels-andrea-piacquadio-3771074.jpg"
                                 alt="Card image cap">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title border-bottom"> <img src="images/svg/boxes.svg"> Resources</h5>
                            <p class="card-text">Here you can find programming tutorials, guided introductions into CFD and
                                and a curated collection of useful information about CFD.
                            </p>
                        </div>
                    </div>
                </a>

                <a href="resources.php" class="card-anchor">
                    <div class="card tile">
                        <div class="card-img-wrapper">
                            <img class="card-img-top" src="images/jpg/pexels-nothing-ahead-3729557.jpg"
                                 alt="Card image cap">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title border-bottom"><img src="images/svg/book-half.svg"> Glossary</h5>
                            <p class="card-text">An alphabetical list of all relevant CFD-Terms, with a short explanation.
                            </p>
                        </div>
                    </div>
                </a>

                <a href="resources.php" class="card-anchor">
                    <div class="card tile">
                        <div class="card-img-wrapper">
                            <img class="card-img-top" src="images/jpg/pexels-lukas-590022.jpg" alt="Card image cap">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title"><img src="images/svg/question-circle.svg"> About</h5>
                            <p class="card-text">Learn more about the purpose and future of this website.</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
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

