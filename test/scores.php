<?php
$host = "localhost";
$dbname = "yatzy";
$user = "postgres";
$password = "admin";

$port = "5432"; 

$connection = pg_connect("host=". $host ." port=". $port ." dbname=". $dbname ." user=". $user ." password=". $password ."");

if (!$connection){
    echo http_response_code(502);
    exit;
}
else {

    $query = "SELECT username, score
              FROM scores left join users on scores.user_id = users.user_id
              ORDER BY score DESC 
              limit 10";
    $query_result = pg_query($connection, $query);

    if (!$query_result){
        // 404 - Resource Not Found
        echo http_response_code(404);
        exit;
    }
    else {
      echo "Global top 10 \n";
      while($row = pg_fetch_assoc($query_result)) {
        echo implode(' ', $row);
        echo "\n";
      }
    }
}
?>

