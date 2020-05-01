<?php

    if(!isset($_POST['secret']) || $_POST['secret']!="SDFGREWR4234SDFSADFFRGRTFSEW5FGSDGSDGd") {
        if(!isset($_COOKIE['stodos_key']) || $_COOKIE['stodos_key']!="SDFGREWR4234SDFSADFFRGRTFSEW5FGSDGSDGd")
        {
            header("HTTP/1.1 401 Unauthorized");
            die("401 Unauthorized");
        }
        echo file_get_contents("main.html");
        die;
    }
    else {
        setcookie("stodos_key", "SDFGREWR4234SDFSADFFRGRTFSEW5FGSDGSDGd",
                  time() + (86400 * 365), "", "",  true, true);
        echo file_get_contents("main.html");
    }
?>


