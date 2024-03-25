
<nav class="navbar navbar-expand-lg navbar-light"  style="background-color: cornflowerblue" >
  <div class="container-fluid">
  <div class="d-flex flex-row" >
    <a class="navbar-brand" href="#" style="height: 100%; width: 100%;">
      <img class="navbar-logo" src="/images/svg/flowLogo.svg">
    </a>


    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">

        <li class="nav-item">
          <a class="nav-link " href="index.php">Home</a>
        </li>

        <li class="nav-item">
          <a class="nav-link active" href="resources.php">Resources</a>
        </li>


        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Simulators
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="simulatorEuler.php">Eulerian</a>
            <a class="dropdown-item" href="simulatorFlip.php">FLIP</a>
          </div>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="glossary.php">Glossary</a>
        </li>

      </ul>
    </div>
  </div>

  <div class="d-flex flex-row justify-content-end">
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">

        <li class="nav-item">
          <button onclick="scrollToTop()" id="scrollToTopBtnHeader" class="scroll-to-top-btn btn btn-primary ms-auto" title="Go to top">Back up</button>
        </li>

        <li class="nav-item">
          <a class="nav-link" href="about.php">About</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="https://github.com/StOe11169/Info1_Website">GitHub <img src="/images/svg/github.svg"> </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" aria-disabled="true" style="color: gainsboro"> Change Language <img src="/images/svg/globe.svg"></a>
        </li>
      </ul>
    </div>

  </div>
  </div>
</nav>