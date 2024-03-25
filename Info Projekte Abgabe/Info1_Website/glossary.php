<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Glossary</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.3.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/breadcrumbs.css">


</head>
<body>

<div class="page-wrapper">

    <div class="header-wrapper">

        <?php include('elements/navbar.php') ?>

        <nav aria-label="breadcrumb">
            <ol class="breadcrumb p-3 bg-body-tertiary rounded-3">
                <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                <li class="breadcrumb-item"><a>Glossary</a></li>
            </ol>
        </nav>

    </div>

    <div class="main-wrapper">

        <!-- Sidebar Navigation-->
        <div class="sidenav-wrapper">
            <nav class="nav flex-column list-group list-group-flush overflow-auto sidenav">
                <a href="#section-a" class="list-group-item list-group-item-action bg-light nav-link nav-item side-nav-link" id="side-nav-sec-a">A</a>
                <a href="#section-b" class="list-group-item list-group-item-action bg-light nav-link nav-item side-nav-link" id="side-nav-sec-b">B</a>
                <a href="#section-c" class="list-group-item list-group-item-action bg-light nav-link nav-item side-nav-link" id="side-nav-sec-c">C</a>
                <!-- Add more links for other letters -->
            </nav>
        </div>

        <div class="center-wrapper">
            <!------Main Page Content -->
            <div class="accordion  accordion-flush col-sm-8 main" id="glossaryAccordion">

                <!-- Section A -->
                <div class="accordion-item ">
                    <h2 class="accordion-header" id="section-a">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-a" aria-expanded="true" aria-controls="collapse-a">
                            A
                        </button>
                    </h2>
                    <div id="collapse-a" class="accordion-collapse collapse" aria-labelledby="section-a" >
                        <div class="accordion-body">
                            <!-- Content for section A -->
                            Content for section A


                            <div class="accordion" >
                                <!-- Sub-accordion A1 -->
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="sub-section-a1">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-a1" aria-expanded="true" aria-controls="collapse-a1">
                                            A1
                                        </button>
                                    </h2>
                                    <div id="collapse-a1" class="accordion-collapse collapse " aria-labelledby="sub-section-a1" >
                                        <div class="accordion-body">
                                            <!-- Content for sub-section A1 -->
                                            Content for sub-section A1
                                        </div>
                                    </div>
                                </div>
                                <!-- Add more sub-accordion items for A2, A3, etc. -->
                                <!-- Sub-accordion A2 -->
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="sub-section-a2">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-a2" aria-expanded="true" aria-controls="collapse-a2">
                                            A2
                                        </button>
                                    </h2>
                                    <div id="collapse-a2" class="accordion-collapse collapse" aria-labelledby="sub-section-a2" >
                                        <div class="accordion-body">
                                            <!-- Content for sub-section A2 -->
                                            Content for sub-section A2
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <button class="btn btn-primary close-accordions-btn" >Close all </button>

                    </div>

                </div>


                <!-- Section B -->
                <div class="accordion-item">
                    <h2 class="accordion-header" id="section-b">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-b" aria-expanded="false" aria-controls="collapse-b">
                            B
                        </button>
                    </h2>
                    <div id="collapse-b" class="accordion-collapse collapse" aria-labelledby="section-b">
                        <div class="accordion-body">
                            Content for section B
                        </div>
                        <button class="btn btn-primary close-accordions-btn">Close all </button>
                    </div>

                </div>

                <!-- Section C -->
                <div class="accordion-item">
                    <h2 class="accordion-header" id="section-c">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-c" aria-expanded="false" aria-controls="collapse-c">
                            C
                        </button>
                    </h2>
                    <div id="collapse-c" class="accordion-collapse collapse" aria-labelledby="section-c" >
                        <div class="accordion-body">
                             Content for section C
                        </div>
                        <button class="btn btn-primary close-accordions-btn">Close all </button>
                    </div>
                </div>
                <!-- Add more accordion items for other letters -->
            </div>

        </div>

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

