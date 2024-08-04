<?php

declare(strict_types=1);
namespace App\Repositories;

// Import class
use App\Database;

class Leaderboard {

    public function __construct(private Database $database){}

    public function getTop10(): array {

        $connection = $this->database->getConnection();

        // SQL statement to return the top 10 scores
        $query = "SELECT date, scores.user_id, score, users.username, users.first_name, users.last_name, regions.region_name FROM public.scores
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

    public function getAllScores(): array {
        $connection = $this->database->getConnection();

        // SQL statement to return the top 10 scores
        $query = "SELECT id, score, users.username, users.user_id, date FROM public.scores
        LEFT JOIN public.users ON public.scores.user_id = public.users.user_id
        ORDER BY id DESC";
        //Changed sort order to DESC so you can see the most recently-created "plays" first in this dataset

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

    /**
     * Returns all scores associated with a given user id
    */
    public function getUserScoreHistory($id): array|bool {
        $connection = $this->database->getConnection();

        // Parameterized to prevent against SQL-injection
        $query = "SELECT score, users.username, date
        FROM public.scores
        LEFT JOIN public.users ON public.scores.user_id = public.users.user_id
        WHERE users.user_id = $1 ORDER BY score DESC";

        if (!$connection){
            // 502 Bad Gateway
            return http_response_code(502);
        }
        else {
            $query_result = pg_query_params($connection, $query, array($id));

            if (!$query_result){
                // 404 - Resource Not Found
                return http_response_code(404);
            }
            else {
                $history = pg_fetch_all($query_result, PGSQL_NUM);
                if (count($history) === 0) {
                    return false;
                }
                return $history;
            }
        }
    }

    /**
     * Adds a new score to the scores table
     * Payload example: {"user_id":2, "score":120}
     */
    public function addNewScore(array $data) {
        $connection = $this->database->getConnection();

        $query = "INSERT INTO public.scores (score, user_id)
        VALUES ($1, $2)";

        if (!$connection){
            return http_response_code(502);
        }
        else {

            $statement = pg_query_params($connection, $query, array($data['score'], $data['user_id']));

            //Return the newly created record
            $new_entry = pg_fetch_all(pg_query($connection, "SELECT * FROM public.scores
            ORDER BY id DESC LIMIT 1"));
            return $new_entry[0];
        }
    }

    /**
     * Removes an instance of a score record with a given id
     * from the scores table.
     */
    public function deleteScore($id) {
    
        $connection = $this->database->getConnection();
        $query = "DELETE FROM public.scores
        WHERE scores.id = $1";

        if (!$connection){
            return http_response_code(502);
        }
        else {
            $statement = pg_query_params($connection, $query, array($id));
        }
    }

}
