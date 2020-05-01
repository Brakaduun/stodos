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

    // Connect to the database
    $db = new PDO('mysql:host=localhost;port=3306;dbname=stodos;charset=utf8',
                  'root','');
    $db->query("SET @@session.time_zone = '+03:00'");

    switch($_GET['action']) {
        case "get":  
            header('Content-Type: application/json');
            echo getTasks();
            break;
        case "update_status":
            header('Content-Type: text/plain');
            echo updateTaskStatus();
            break;
        case "update":
            header('Content-Type: text/plain');
            echo updateTask();
            break;
        case "insert":
            header('Content-Type: text/plain');
            echo insertTask();
            break;
        case "delete":
            header('Content-Type: text/plain');
            echo deleteTask();
            break;
        default: 
            header("HTTP/1.1 400 Bad Request");
            die("400 Bad Request");
    }

    $db = null;

    exit;

    // ----- 
    function getTasks() : string {
        $qs = getLibQueries();
        $db = $GLOBALS['db'];

        $result = $db->query($qs['LIST']);
        $res = $result->fetchAll(PDO::FETCH_ASSOC);

        return json_encode($res);
    }

    function updateTaskStatus() {
        $qs = getLibQueries();
        $db = $GLOBALS['db'];

        $stmt = $db->prepare($qs['UPDATE STATUS']);
        $ok = $stmt->execute([':done' => $_POST['done'], ':id' => $_POST['id']]);

        return $ok ? "OK" : "KO";
    }

    function updateTask() {
        $qs = getLibQueries();
        $db = $GLOBALS['db'];

        $stmt = $db->prepare($qs['UPDATE']);
        $ok = $stmt->execute([':id' => $_POST['id'], ':label' => $_POST['label']]);

        return $ok ? "OK" : "KO";
    }

    function insertTask() {
        $qs = getLibQueries();
        $db = $GLOBALS['db'];

        $stmt = $db->prepare($qs['INSERT']);
        $ok = $stmt->execute([':label' => $_POST['label']]);

        return $ok ? $db->lastInsertId() : "KO";
    }

    function deleteTask() {
        $qs = getLibQueries();
        $db = $GLOBALS['db'];

        $stmt = $db->prepare($qs['DELETE']);
        $ok = $stmt->execute([':id' => $_POST['id']]);

        return $ok ? "OK" : "KO";        
    }



    function getLibQueries() : array {
        $res = [];
        $lib = file_get_contents("queries.lib.sql");
        $parts = explode("-- --", $lib);
        array_shift($parts);
        foreach($parts as $part) {
            $pos = strpos($part, "\n");
            $key = trim(substr($part, 0, $pos));
            $val = trim(substr($part, $pos));
            $res[$key] = $val;
        }
        return $res;        
    }

    
?>