<?php

declare(strict_types=1);

use Slim\Factory\AppFactory;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Selective\BasePath\BasePathMiddleware;
use DI\ContainerBuilder; //Dependency Injector
use Slim\Handlers\Strategies\RequestResponseArgs;
use App\Middleware\AddJsonResponseHeader;

require_once __DIR__ . '/../vendor/autoload.php';

// Configure application with dependency injector container
$builder = new ContainerBuilder;
$container = $builder->addDefinitions(__DIR__ . "/../config/definitions.php")->build();
AppFactory::setContainer($container);

session_start();

// $host = "localhost";
// $dbname = "yatzy";
// $user = "yatzyuser";
// $password = "password";

// $port = "5432"; 

// $connection = pg_connect("host=". $host ." port=". $port ." dbname=". $dbname ." user=". $user ." password=". $password ."");

function jsonReply(Response $response, $data)
{
    $payload = json_encode($data);
    $response->getBody()->write($payload);
    return $response->withHeader('Content-Type', 'application/json');
}

// Static method
$app = AppFactory::create();

// Allows the passage of string variables by variable name instead of 'array $args' in requests
$collector = $app->getRouteCollector();
$collector->setDefaultInvocationStrategy(new RequestResponseArgs);

// Set responses to have JSON headers be default
$app->add(new AddJsonResponseHeader);

// For POST requests
$app->addBodyParsingMiddleware();

// Add Slim routing middleware
$app->addRoutingMiddleware();

// Set the base path to run the app in a subdirectory.
// This path is used in urlFor().
$app->add(new BasePathMiddleware($app));

// Import error middleware - see https://www.slimframework.com/docs/v4/middleware/error-handling.html
$error_middleware = $app->addErrorMiddleware(true, true, true);
$error_handler = $error_middleware->getDefaultErrorHandler();
$error_handler->forceContentType('application/json'); //make error reports into json instead of displaying a trace or HTML garble

/**
 * Establish the route for the app root.
 */
$app->get('/', function (Request $request, Response $response) {
    $view = file_get_contents("index.html");
    $response->getBody()->write($view);

    // If header unassigned here, it would default to JSON and cause rendering errors
    return $response->withHeader('Content-Type', 'text/html');
});


// TODO: Login

// TODO: Logout

/**
 * Endpoint for retrieving the top 10 leaderboard data.
 */
$app->get('/api/scores/top10', App\Controllers\ScoresIndex::class . ':getTop10');

/**
 * Endpoint for retrieving all scores
 */
$app->get('/api/scores', App\Controllers\ScoresIndex::class . ':getAllScores');

/**
 * Endpoint for a retrieving a specific user's score history
 */
$app->get('/api/scores/{user_id:[0-9]+}', App\Controllers\ScoresIndex::class . ':getUserScores')->add(App\Middleware\GetUserScores::class);

/**
 * Endpoint for inserting a new score into the score records.
 */
$app->post('/api/scores', [App\Controllers\ScoresIndex::class, 'addNewScore']);

/**
 * Endpoint for deleting a score from the score records.
 */
$app->delete('/api/scores/{id:[0-9]+}', App\Controllers\ScoresIndex::class . ':deleteScore')->add(App\Middleware\GetScore::class);
;

/**
 * Endpoint for retrieving all user data.
 * See .\src\App\Controllers\UserIndex.php for details of the endpoint.
 */
$app->get('/api/users', App\Controllers\UserIndex::class . ':getAllUsers');

/**
 * Endpoint for a specific user's account info, for a non-admin profile purposes
 * See details at .\src\App\Controllers\UserProfile.php and .\src\App\Middleware\GetUser.php
 */
$app->get('/api/users/{user_id:[0-9]+}', App\Controllers\UserIndex::class . ':getUser')->add(App\Middleware\GetUser::class);

// Update some of the fields associated with a user account.
$app->patch('/api/users/{user_id:[0-9]+}', [App\Controllers\UserIndex::class, 'updateUser'])->add(App\Middleware\GetUser::class);

/**
 * Endpoint for deleting a score from the score records.
 */
$app->delete('/api/users/{id:[0-9]+}', App\Controllers\UserIndex::class . ':deleteUser')->add(App\Middleware\DeleteUser::class);
;


/**
 * Endpoint for getting a list of all the possible geographic location categories
 * a player can assign to themselves / their account info.
 * See .\src\App\Controllers\RegionIndex.php for details of the endpoint.
 */
$app->get('/api/regions', App\Controllers\RegionIndex::class);

// Create a new user account with all the associated information (some of it optional)
$app->post('/api/signup', [App\Controllers\UserIndex::class, 'addNewUser']);

// First endpoint created for Assignment 3 remains below. We will need to remove this and replace where it is called with the add new score item above, but only when logged in and when there is a user ID

/**
 * URL: /score
 * saves player name and score to session variable
 */
// $app->post('/score', function(Request $request, Response $response, array $args) {
//     $userId = $request->getParsedBody()['userId'];
//     $score = $request->getParsedBody()['score'];

//     //temp user id
//     $userId = 1;

//     if (!$GLOBALS['connection']){
//         return http_response_code(502);
//     }
//     else {
//         $query = "INSERT INTO scores ( score, user_id ) VALUES ('{$score}', '{$userId}');";
                
//         $query_result = pg_query($GLOBALS['connection'], $query);

//         if ($query_result) {
//             $query = "SELECT username, score
//                     FROM scores left join users on scores.user_id = users.user_id
//                     ORDER BY score DESC 
//                     limit 10";
        
//             $query_result = pg_query($GLOBALS['connection'], $query);
//             $results = pg_fetch_all($query_result);
//             jsonReply($response, $results);
//         }
//     }
    
//     return $response; 
// });

// /**
//  * URL: /getleaderboard
//  * no parameters
//  * gets the top 10 global leaderboard without entering a score
//  */
// $app->get('/leaderboard', function(Request $request, Response $response, array $args) {
//     if (!$GLOBALS['connection']){
//         return http_response_code(502);
//     }
//     else {
//         $query = "SELECT username, score
//                     FROM scores left join users on scores.user_id = users.user_id
//                     ORDER BY score DESC 
//                     limit 10";
                
//         $query_result = pg_query($GLOBALS['connection'], $query);
//         $results = pg_fetch_all($query_result);
//         jsonReply($response, $results);
//     }
    
//     return $response; 
// });

// /**
//  * URL: /leaderboard/{id}
//  * params: user id
//  * gets all of the user's scores
//  */
// $app->get('/leaderboard/{id}', function(Request $request, Response $response, array $args) {
//     $userId = $request->getQueryParams()['id'];

//     //temp user id
//     $userId = 1;

//     if (!$GLOBALS['connection']){
//         return http_response_code(502);
//     }
//     else {
//         $query = "SELECT username, score
//                     FROM scores left join users on scores.user_id = users.user_id
//                     WHERE scores.user_id = '{$userId}'";
                
//         $query_result = pg_query($GLOBALS['connection'], $query);
//         $results = pg_fetch_all($query_result);
//         jsonReply($response, $results);
//     }
    
//     return $response; 
// });

// Run app
$app->run();