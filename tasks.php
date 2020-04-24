<?php

    if(!isset($_COOKIE['stodos_key']) || $_COOKIE['stodos_key']!="SDFGREWR4234SDFSADFFRGRTFSEW5FGSDGSDGd")
    {
        header("HTTP/1.1 401 Unauthorized");
        die("401 Unauthorized");
    }

    if (!isset($_GET['action'])) {
        header("HTTP/1.1 400 Bad Request");
        die("400 Bad Request");
    }

    switch($_GET['action']) {
        case "get":  
            header('Content-Type: application/json');
            echo file_get_contents('tasks.json');
            break;
        case "save":  
            if (!isset($_POST['tasks'])) {
                header("HTTP/1.1 400 Bad Request");
                die("400 Bad Request");
            }
            $tasks = json_encode($_POST['tasks'],  JSON_PRETTY_PRINT);
            if ($tasks === false) {
                header("HTTP/1.1 422 Unprocessable Entity");
                die("422 Unprocessable Entity");
            }
            $ok = file_put_contents('tasks.json', $tasks);
            header('Content-Type: text/plain');
            if ($ok === false) {
                echo "KO";
            }
            else {
                echo "OK";
            }
            break;
    }
    
?>