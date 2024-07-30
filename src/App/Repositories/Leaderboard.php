<?php

declare(strict_types=1);
namespace App\Repositories;

// Import class
use App\Database;

class Leaderboard {

    public function __construct(private Database $database) {

    }
    public function getTop10(): array
    {

        $connection = $this->database->getConnection();

        // SQL statement to return the top 10 scores
        $query = "SELECT score, users.username, users.first_name, users.last_name, regions.region_name FROM public.scores
        LEFT JOIN public.users ON public.scores.user_id = public.users.user_id
        LEFT JOIN public.regions ON public.users.region_id = public.regions.region_id
        ORDER BY score DESC
        LIMIT 10";
    
        if (!$connection){
            // 502 Bad Gateway
            return http_response_code(502);
        }
        else {
            $query_result = pg_query($connection, $query);
            if (!$query_result){
                // 404 - Resource Not Found
                return http_response_code(404);
            }
            else {
                return pg_fetch_all($query_result, PGSQL_NUM);
            }
        }
    }

    public function getAllScores(): array
    {

        $connection = $this->database->getConnection();

        // SQL statement to return the top 10 scores
        $query = "SELECT id, score, users.username, users.user_id, date FROM public.scores
        LEFT JOIN public.users ON public.scores.user_id = public.users.user_id
        ORDER BY id ASC";
    
        if (!$connection){
            // 502 Bad Gateway
            return http_response_code(502);
        }
        else {
            $query_result = pg_query($connection, $query);
            if (!$query_result){
                // 404 - Resource Not Found
                return http_response_code(404);
            }
            else {
                return pg_fetch_all($query_result, PGSQL_NUM);
            }
        }
    }

    public function addNewScore(){

    }

    public function removeScore(){

    }
}