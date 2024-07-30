<?php

// Database configuration settings. Can modify to get this up and running on your own machine, if needed!

use App\Database;

return [
    Database::class => function () {
        return new Database(
            host: "localhost",
            dbname: "yatzy",
            user: "postgres",
            password: "admin",
            port: "5433"
        );
    }
];