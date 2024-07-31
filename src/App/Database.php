<?php

declare(strict_types=1);

namespace App;

class Database {

    public function __construct(private string $host,
                                private string $dbname,
                                private string $user,
                                private string $password,
                                private string $port){
    }
    public function getConnection(){

        $connection = pg_connect("host=". $this->host ." port=". $this->port ." dbname=". $this->dbname ." user=". $this->user ." password=". $this->password ."");

        return $connection;
    }
}