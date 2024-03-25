This project is a continuation of a already existing project, of which the original README is listed below.
This repo is meant as a mode of easy access of the added files.
An attempt was made to integrate the simulator into a website and integrate a database for analysis and comparison.
Microsoft Access 2016 was used as a DBMS, as it was mandatory within the project ramifications. For this version of access there exists no driver to connect the JavaScript simulations
via PDO and ODBC. To get some working data, for a proof of concept, a Python-script was written, which can be seen in the folder 'additionals'.
Website and database are separated, as they are distinct projects. The documentation files for each are currently only in German.

Possible Problems: 
During attempts to create a connection between website and ms-access database, the .accdb file got weirdly corrupted.
Although made with MS-Access 2016 directly opening it can result in the following error "A newer version of Microsoft Access is needed to open this database".
Further a warning message might occur, regarding the trustworthiness of the database.
Both problems can be circumvented by first opening MS-Access and then opening the database from within the Access-explorer. At least that worked on my local system.

This repo will probably be purged at some point, as the existing approach has gotten convoluted and a 'fresh' start with a new approach will probably be a better approach.



---------------------------------------------------------OLD-Readme---------------------------------------------------------


# FluidSim_PT
This project is a based on the works of Mathias Muelle from TenMinutePhysics ( https://www.youtube.com/@TenMinutePhysics) and is an extension of their already written code. The idea behind this project is to improve the already existing simulator by adding functions that simulate the behavior of a fluid more accurately.
The aim was not to build a simulator that performs on the same level as commercial products, but to build an easily editable and expandable framework. This project is meant as a tool to teach the application of numerical approaches to difficult topics, such as the Navier-Stokes equation.
Therefore it is written in plain JavaScript up to this point and requires no additional dependencies.
For a more extensive library of examples, e.g. a narrowing pipe, I will probably switch the project over to p5.js.

The project is still not entirely finished but incorporates methods to allow for the modelling the effects of a pressure gradient, viscosity and diffusion on the flow of the fluid.

It is still assumed, that the fluid is incompressible, viscosity and density are constant and that the process is isothermal.

This project is a based on the works of [10min physics] and is an extension of their already written code. The idea behind this project is to improve the already existing simulator by adding functions that simulate the behavior of a fluid more accurately.
The aim was not to build a simulator that performs on the same level as commercial products, but to build an easily editable and expandable framework. This project is meant as a tool to teach the application of numerical approaches to difficult topics, such as the Navier-Stokes equation.
Therefore it is written in plain JavaScript up to this point and requires no additional dependencies.
For a more extensive library of examples, e.g. a narrowing pipe, I will probably switch the project over to p5.js.

The project is still not entirely finished but incorporates methods to allow for the modelling the effects of a pressure gradient, viscosity and diffusion on the flow of the fluid.

It is still assumed, that the fluid is incompressible, viscosity and density are constant and that the process is isothermal.

Used resources: 

http://www.thevisualroom.com/index.html

https://matthias-research.github.io/pages/tenMinutePhysics/index.html

https://github.com/matthias-research/pages/blob/master/tenMinutePhysics/17-fluidSim.html

https://john-s-butler-dit.github.io/NumericalAnalysisBook/Chapter%2009%20-%20Elliptic%20Equations/901_Poisson%20Equation-Laplacian.html





