<?php

$connection = pg_connect("host=localhost port=5433 dbname=yatzy user=postgres password=admin");

if (!$connection){
    // 502 Bad Gateway
    // This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.

    // return http_response_code(502);
    echo http_response_code(502);
    exit;
}
else {

    $query_result = pg_query($connection, "SELECT * FROM users");

    if (!$query_result){
        // 404 - Resource Not Found
        echo http_response_code(404);
        exit;
    }
    else {
        echo "<table>";
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
    }

}