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
        $query = "SELECT user_id, username, first_name, last_name, regions.region_name, account_types.type_desc FROM public.users
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

    public function getUser($id): array|bool{
        $connection = $this->database->getConnection();

        // SQL statement to return the top 10 scores
        $query = "SELECT user_id, username, first_name, last_name, regions.region_name FROM public.users
        LEFT JOIN public.regions ON public.users.region_id = public.regions.region_id
        WHERE user_id = $1";
        
        $qname = "user_info";
        $sql = pg_prepare($connection, $qname, $query);
    
        if (!$connection){
            // 502 Bad Gateway
            return http_response_code(502);
        }
        else {
            $query_result = pg_execute($connection, $qname, array($id));
            if (!$query_result){
                // 404 - Resource Not Found
                return http_response_code(404);
            }
            else {
                return pg_fetch_assoc($query_result);
            }
        }
    }

    public function login($username, $password): array|bool
    {
        // TODO: Just for testing right now, no DB validation yet.
        return [$username, $password];
    }

    // Registration. By default, our GUI forces all users to be registered as "players".
    // You cannot make yourself an admin via our interface, although there are features that are locked to the admin user type.
    // Please use our SEED data in our schema with pre-loaded admin accounts, or just add one yourself via a POSTGRESQL insert statement.
    
    public function addUser($username, $password, $firstName, $lastName=null, $regionId=null){
    // TODO: Implement
    }

    // Admins can delete user accounts.
    public function removeUser($id){
// TODO: Implement
    }

    // Only allows updating of the user's first_name, last_name, and region_id.
    // Users who want to change usernames must request their account be deleted instead and then make a new one.
    // Also in this hypothetical yatzy company, a PW reset can be done via emailing the fictitious admin.
    // Every user, regardless of type, can access their own account info

    public function updateUser($id, $firstName, $lastName, $regionId){

    }
}