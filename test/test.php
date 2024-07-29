<?php

// Holy grail of troubleshooting
// https://stackoverflow.com/questions/10640821/how-do-i-enable-php-to-work-with-postgresql

$host = "localhost";
$dbname = "yatzy";
$user = "postgres";
$password = "admin";

$port = "5433"; //This not the default port, so I will have to change my install settings. But it is working for now!

$connection = pg_connect("host=". $host ." port=". $port ." dbname=". $dbname ." user=". $user ." password=". $password ."");

function read_data($query){

    if (!$connection){
        // 502 Bad Gateway
        // This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
    
        // return http_response_code(502);
        echo http_response_code(502);
        exit;
    }
    else {
    
        $query = "SELECT * FROM users";
        $query_result = pg_query($connection, $query);
    
        if (!$query_result){
            // 404 - Resource Not Found
            echo http_response_code(404);
            exit;
        }
        else {
            echo "<table>";
            echo "<tr>
                <th>UID</th>
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Password</th>
                <th>Location (lat, long)</th>
                <th>Account Type</th>
            </tr>";
    
            while($row = pg_fetch_assoc($query_result)){
                echo "<tr>
                    <td>$row[user_id]</td>
                    <td>$row[username]</td>
                    <td>$row[first_name]</td>
                    <td>$row[last_name]</td>
                    <td>$row[password]</td>
                    <td>$row[position]</td>
                    <td>$row[type_id]</td>
                    </tr>";
            }
            echo "</table>";
            exit;
        }
    }

}

