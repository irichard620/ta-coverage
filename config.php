<?php
    $host = 'dbserver.engr.scu.edu';
    $dbname = 'sdb_irichard';
    $username = 'irichard';
    $password = '00001003258';
  
    try {
    	// PDO is a PHP driver, implements PHP Data Objects Interface, enables access between PHP and MySQL (Version 5 in our case)
    	$db_conn = new PDO("mysql:dbname=$dbname;host=$host", $username, $password);
    } catch (PDOException $e) {
    	echo 'DB Connection failed with error: ' . $e->getMessage();
    }
?>
