<?php
// Define  connection string
$connStr = 'odbc:Driver={Microsoft Access Driver (*.mdb, *.accdb)};' .
    'Dbq=\\Users\\Stefan\\sciebo2\\Info 1+2 Projekte\\Info Projekte Abgabe\\Info2_Database\\fluidSimDB.accdb';

try {
    // establish database connection
    $dbh = new PDO($connStr);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Connection to the database established successfully.\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}



