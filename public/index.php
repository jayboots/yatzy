<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Selective\BasePath\BasePathMiddleware;
use Slim\Factory\AppFactory;

include("app/models/score.php");

require_once __DIR__ . '/../vendor/autoload.php';

session_start();

$host = "localhost";
$dbname = "yatzy";
$user = "postgres";
$password = "admin";

$port = "5432"; 

$connection = pg_connect("host=". $host ." port=". $port ." dbname=". $dbname ." user=". $user ." password=". $password ."");

function jsonReply(Response $response, $data)
{
    $payload = json_encode($data);
    $response->getBody()->write($payload);
    return $response->withHeader('Content-Type', 'application/json');
}

// Static method
$app = AppFactory::create();

$app->addBodyParsingMiddleware();

// Add Slim routing middleware
$app->addRoutingMiddleware();

// Set the base path to run the app in a subdirectory.
// This path is used in urlFor().
$app->add(new BasePathMiddleware($app));

$app->addErrorMiddleware(true, true, true);

/**
 * placeholder for homepage
 */
$app->get('/', function (Request $request, Response $response, array $args) {
    $view = file_get_contents("index.html");
    $response->getBody()->write($view);
    return $response;
});

/**
 * URL: /score
 * saves player name and score to session variable
 */
$app->post('/score', function(Request $request, Response $response, array $args) {
    $userId = $request->getParsedBody()['userId'];
    $score = $request->getParsedBody()['score'];

    //temp user id
    $userId = 1;

    if (!$GLOBALS['connection']){
        return http_response_code(502);
    }
    else {
        $query = "INSERT INTO scores ( score, user_id ) VALUES ('{$score}', '{$userId}');";
                
        $query_result = pg_query($GLOBALS['connection'], $query);

        if ($query_result) {
            $query = "SELECT username, score
                    FROM scores left join users on scores.user_id = users.user_id
                    ORDER BY score DESC 
                    limit 10";
        
            $query_result = pg_query($GLOBALS['connection'], $query);
            $results = pg_fetch_all($query_result);
            jsonReply($response, $results);
        }
    }
    
    return $response; 
});

/**
 * URL: /getleaderboard
 * no parameters
 * gets the top 10 global leaderboard without entering a score
 */
$app->get('/leaderboard', function(Request $request, Response $response, array $args) {
    if (!$GLOBALS['connection']){
        return http_response_code(502);
    }
    else {
        $query = "SELECT username, score
                    FROM scores left join users on scores.user_id = users.user_id
                    ORDER BY score DESC 
                    limit 10";
                
        $query_result = pg_query($GLOBALS['connection'], $query);
        $results = pg_fetch_all($query_result);
        jsonReply($response, $results);
    }
    
    return $response; 
});

/**
 * URL: /leaderboard/{id}
 * params: user id
 * gets all of the user's scores
 */
$app->get('/leaderboard/{id}', function(Request $request, Response $response, array $args) {
    $userId = $request->getQueryParams()['id'];

    //temp user id
    $userId = 1;

    if (!$GLOBALS['connection']){
        return http_response_code(502);
    }
    else {
        $query = "SELECT username, score
                    FROM scores left join users on scores.user_id = users.user_id
                    WHERE scores.user_id = '{$userId}'";
                
        $query_result = pg_query($GLOBALS['connection'], $query);
        $results = pg_fetch_all($query_result);
        jsonReply($response, $results);
    }
    
    return $response; 
});

// Run app
$app->run();