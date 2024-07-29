<?php

declare(strict_types=1);

namespace App;

class Database { 
    public function getConnection(){

        $host = "localhost";
        $dbname = "yatzy";
        $user = "postgres";
        $password = "admin";

        $port = "5433";

        $connection = pg_connect("host=". $host ." port=". $port ." dbname=". $dbname ." user=". $user ." password=". $password ."");

        return $connection;
    }
}