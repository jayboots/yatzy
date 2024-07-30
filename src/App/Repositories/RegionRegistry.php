<?php

declare(strict_types=1);
namespace App\Repositories;

// Import class
use App\Database;

class RegionRegistry {

    public function __construct(private Database $database) {

    }

    // Could paginate these results.
    public function getRegions(): array
    {
        $connection = $this->database->getConnection();

        // SQL statement to return the top 10 scores
        $query = "SELECT * FROM public.regions
        ORDER BY region_name ASC";
    
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

}