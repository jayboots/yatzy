<?php

declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Selective\BasePath\BasePathMiddleware;
use Slim\Factory\AppFactory;

require_once __DIR__ . '/../vendor/autoload.php';

session_start();

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
 * Establish the app root.
 */
$app->get('/', function (Request $request, Response $response, array $args) {
    $view = file_get_contents("index.html");
    // include 'app/navbar.php';
    $response->getBody()->write($view);
    return $response;
});

/**
 * Routing for the leaderboard data
 */
$app->get('/api/leaderboard', function (Request $request, Response $response, array $args) {

    require __DIR__ . '/../src/App/Database.php';
    $db = new App\Database;
    $dbconn = $db->getConnection();

    $body = json_encode(get_top_10($dbconn));
    $response->getBody()->write($body);
    return $response;
});

/**
 * URL: /score
 * saves player name and score to session variable and returns the top 10 scores
 */
$app->post('/score', function(Request $request, Response $response, array $args) {
    $name = $request->getParsedBody()['name'];
    $score = $request->getParsedBody()['score']; // As noted by Tori, this is currently being read from the 'total score' UI element.

    //if scoreboard is not set -> create new session var; else add score to scoreboard
    if (!isset($_SESSION['scoreboard'])){
        $_SESSION['scoreboard'] = array();
      }
    $_SESSION['scoreboard'][] = new Score($name, $score);

    //sort to get top 10 (descending)
    function comparitor($a, $b) {
        return $b->score <=> $a->score;
    }
    usort($_SESSION['scoreboard'], 'comparitor');

    //response
    jsonReply($response, array_slice($_SESSION['scoreboard'],0,10));
    return $response; 
});


function get_top_10($connection){

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

// Run app
$app->run();