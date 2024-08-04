<?php

declare(strict_types=1);

use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;
use Slim\Handlers\Strategies\RequestResponseArgs;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Selective\BasePath\BasePathMiddleware;
use DI\ContainerBuilder; //Dependency Injector
use App\Middleware\AddJsonResponseHeader;
use App\Middleware\DeleteUser;
use App\Middleware\GetScore;
use App\Middleware\GetUser;
use App\Middleware\GetUserScores;
use App\Controllers\RegionIndex;
use App\Controllers\ScoresIndex;
use App\Controllers\UserIndex;

require_once __DIR__ . '/../vendor/autoload.php';

// Configure application with dependency injector container
$builder = new ContainerBuilder;
$container = $builder->addDefinitions(__DIR__ . "/../config/definitions.php")->build();
AppFactory::setContainer($container);

session_start();

$_SESSION["loggedIn"];
$_SESSION["isAdmin"];
$_SESSION["userID"];

// Static method
$app = AppFactory::create();

// Allows the passage of string variables by variable name instead of 'array $args' in requests
$collector = $app->getRouteCollector();
$collector->setDefaultInvocationStrategy(new RequestResponseArgs);

$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->add(new AddJsonResponseHeader);
$app->add(new BasePathMiddleware($app));

// Import error middleware - see https://www.slimframework.com/docs/v4/middleware/error-handling.html
$error_middleware = $app->addErrorMiddleware(true, true, true);
$error_handler = $error_middleware->getDefaultErrorHandler();
$error_handler->forceContentType('application/json'); //make error reports into json instead of displaying a trace or HTML garble

//Main page loading route for the app root.
$app->get('/', function (Request $request, Response $response) {
    $view = file_get_contents("index.html");
    $response->getBody()->write($view);

    // If header unassigned here, it would default to JSON and cause rendering errors
    return $response->withHeader('Content-Type', 'text/html');
});

$app->group('/api/session', function (RouteCollectorProxy $group){

    // Login
    $group->get('/login', function (Request $request, Response $response) {
        
        $_SESSION["loggedIn"] = true;
        $_SESSION["isAdmin"] = true;
        $_SESSION["userID"] = 1;

        $vars = stateVars();
        $response->getBody()->write($vars);

        // If header unassigned here, it would default to JSON and cause rendering errors
        return $response;
    });

    // Logout
    $group->get('/logout', function (Request $request, Response $response) {
        
        $_SESSION["loggedIn"] = false;
        $_SESSION["isAdmin"] = false;
        $_SESSION["userID"] = null;

        $vars = stateVars();
        $response->getBody()->write($vars);

        // If header unassigned here, it would default to JSON and cause rendering errors
        return $response;
    });

    $group->get('', function (Request $request, Response $response) {
        $vars = stateVars();
        $response->getBody()->write($vars);
        // If header unassigned here, it would default to JSON and cause rendering errors
        return $response;
    });

});

function stateVars(){

    $vars = array(
        array('loggedIn' => $_SESSION["loggedIn"]),
        array('isAdmin' => $_SESSION["isAdmin"]),
        array('userID' => $_SESSION["userID"])
    );

    return json_encode($vars);
}

$app->group('/api/scores', function (RouteCollectorProxy $group){

    //Endpoint for retrieving the top 10 leaderboard data.
    $group->get('/top10', ScoresIndex::class . ':getTop10');

    //Endpoint for retrieving all scores
    $group->get('', ScoresIndex::class . ':getAllScores');

    //Endpoint for a retrieving a specific user's score history
    $group->get('/{user_id:[0-9]+}', ScoresIndex::class . ':getUserScores')->add(GetUserScores::class);

    //Endpoint for inserting a new score into the score records.
    $group->post('', [ScoresIndex::class, 'addNewScore']);

    //Endpoint for deleting a score from the score records.
    $group->delete('/{id:[0-9]+}', ScoresIndex::class . ':deleteScore')->add(GetScore::class);
});

$app->group('/api/users', function (RouteCollectorProxy $group){

    // Endpoint for retrieving all user data.
    $group->get('', UserIndex::class . ':getAllUsers');

    //Endpoint for a specific user's account info, for a non-admin profile purposes
    $group->get('/{user_id:[0-9]+}', UserIndex::class . ':getUser')->add(GetUser::class);

    // Update some of the fields associated with a user account.
    $group->patch('/{user_id:[0-9]+}', [UserIndex::class, 'updateUser'])->add(GetUser::class);

    //Endpoint for deleting a score from the score records.
    $group->delete('/{id:[0-9]+}', UserIndex::class . ':deleteUser')->add(DeleteUser::class);

    // Create a new user account with all the associated information (some of it optional)
    $group->post('/signup', [UserIndex::class, 'addNewUser']);
});

//Endpoint for getting all geographic location categories a player can assign to themselves.
$app->get('/api/regions', RegionIndex::class);

//==========Integrating this code==========

// function jsonReply(Response $response, $data)
// {
//     $payload = json_encode($data);
//     $response->getBody()->write($payload);
//     return $response->withHeader('Content-Type', 'application/json');
// }

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