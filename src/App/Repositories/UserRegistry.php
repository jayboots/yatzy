<?php

declare(strict_types=1);
namespace App\Repositories;

// Import class
use App\Database;

class UserRegistry {

    public function __construct(private Database $database) {

    }
    public function getAllUsers(): array
    {

        $connection = $this->database->getConnection();

        // SQL statement to return the top 10 scores
        $query = "SELECT user_id, username, first_name, last_name, regions.region_name, account_types.type_id, account_types.type_desc FROM public.users
        LEFT JOIN public.regions ON public.users.region_id = public.regions.region_id
        LEFT JOIN public.account_types ON public.users.type_id = public.account_types.type_id
        ORDER BY user_id ASC";
    
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

    public function getUser(int $id): array|bool{
        $connection = $this->database->getConnection();

        // SQL statement to return the top 10 scores
        $query = "SELECT user_id, username, first_name, last_name, regions.region_name FROM public.users
        LEFT JOIN public.regions ON public.users.region_id = public.regions.region_id
        WHERE user_id = $1";
    
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
                return pg_fetch_assoc($query_result);
            }
        }
    }


    /** Adds a new user to the users table
     * Payload example:
     * {
     *  "username":"mrtestguy",
     *  "first_name":"test",
     *  "last_name":"guy",
     *  "region_id": 1
     * }
     * username must be unique
     * last_name and region_id can be null / absent and changed by user later.
     */ 
    public function addNewUser(array $data) {
        //NOTE: GUI and DB default params force all users to be registered as "players". As a deliberate design choice, you cannot make yourself an admin via the front-end interface. Please use our SEED data in our schema with pre-loaded admin accounts, or just add one yourself via a POSTGRESQL insert statement.
        $connection = $this->database->getConnection();

        $query = "INSERT INTO public.users (username, first_name, last_name, password, region_id)
        VALUES ($1, $2, $3, $4, $5)";

        if (!$connection){
            return http_response_code(502);
        }
        else {

            if (empty($data["last_name"])){
                $last_name = null;
            }
            else{
                $last_name = ucfirst(strtolower($data["last_name"]));
            }

            if (empty($data["region_id"])){
                $region_id = null;
            }
            else{
                $region_id = $data["region_id"];
            }

            $statement = pg_query_params($connection, $query, array(
                strtolower($data['username']),
                ucfirst(strtolower($data['first_name'])),
                $last_name,
                $data['password'],
                $region_id)
            );
            
            // Determine status
            if ($statement){
                //Return the newly created record
                $new_user = pg_fetch_all(pg_query($connection, "SELECT * FROM public.users
                ORDER BY user_id DESC LIMIT 1"));

                // Update Session Variables
                $_SESSION["loggedIn"] = true;
                $_SESSION["isAdmin"] = false; 
                $_SESSION["userID"] = (int) $new_user[0]["user_id"];
                // header("Location: /");
                exit;
            }
            else{
                return $statement;
            }
        }
    }

    // Checks to see if a user exists
    public function validateUser(array $data) {
        $connection = $this->database->getConnection();

        $query = "SELECT *
        FROM public.users
        WHERE users.username = $1 AND users.password = $2";

        if (!$connection){
            return http_response_code(502);
        }
        else {
            $query_result = pg_query_params($connection, $query, array(
                $data['username'],
                $data['password']
            ));
            if (!$query_result){
                return http_response_code(404);
            }
            else {
                return pg_fetch_all($query_result);
            }
        }
    }

    /**
     * Update a user's first name, last name, password, and region ID.
     * First name and password are required and cannot be null.
     * @param array $data
     * @param int $id
     * @return array|bool|int
     */
    public function updateUser(array $data, int $id) {
        $connection = $this->database->getConnection();

        $query = "UPDATE public.users
        SET first_name=$1, last_name=$2, region_id=$3
        WHERE user_id = $4";

        if (!$connection){
            return http_response_code(502);
        }
        else {

            $oldInfo = $this->getUser($id);

            if (empty($data["first_name"])){
                $first_name = $oldInfo["first_name"];
            }
            else{
                $first_name = ucfirst(strtolower($data["first_name"]));
            }

            if (empty($data["last_name"])){
                $last_name = null;
            }
            else{
                $last_name = ucfirst(strtolower($data["last_name"]));
            }

            if (empty($data["region_id"])){
                $region_id = null;
            }
            else{
                $region_id = $data["region_id"];
            }

            $statement = pg_query_params($connection, $query, array(
                $first_name, 
                $last_name,
                $region_id,
                $id)
            );

            $newInfo = $this->getUser($id);
            return $newInfo;
        }
    }

    public function deleteUser(int $id) {
    
        $connection = $this->database->getConnection();

        $query = "DELETE FROM public.users
        WHERE users.user_id = $1";

        if (!$connection){
            return http_response_code(502);
        }
        else {

            $statement = pg_query_params($connection, $query, array($id));
        }
    }
}