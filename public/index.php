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

// Page Routing
$app->get('/', function (Request $request, Response $response) {

    // Always check to see if these have been set or not.
    checkForSessionVars();

    $view = file_get_contents("index.html");
    $response->getBody()->write($view);

    // If header unassigned here, it would default to JSON and cause rendering errors
    return $response->withHeader('Content-Type', 'text/html');
});

$app->get('/admin/manage-scores', function (Request $request, Response $response) {

    // Especially important for admin...
    checkForSessionVars();

    $view = file_get_contents("./pages/manage-scores.html");
    $response->getBody()->write($view);
    return $response->withHeader('Content-Type', 'text/html');
});

$app->get('/admin/manage-users', function (Request $request, Response $response) {

    // Especially important for admin...
    checkForSessionVars();

    $view = file_get_contents("./pages/manage-users.html");
    $response->getBody()->write($view);
    return $response->withHeader('Content-Type', 'text/html');
});

$app->get('/profile', function (Request $request, Response $response) {

    checkForSessionVars();

    $view = file_get_contents("./pages/profile.html");
    $response->getBody()->write($view);
    return $response->withHeader('Content-Type', 'text/html');
});

$app->get('/sign-up', function (Request $request, Response $response) {

    $view = file_get_contents("./pages/signup.html");
    $response->getBody()->write($view);
    return $response->withHeader('Content-Type', 'text/html');
});

$app->get('/log-in', function (Request $request, Response $response) {

    $view = file_get_contents("./pages/login.html");
    $response->getBody()->write($view);
    return $response->withHeader('Content-Type', 'text/html');
});

$app->get('/leaderboard', function (Request $request, Response $response) {
    $view = file_get_contents("./pages/leaderboard.html");
    $response->getBody()->write($view);
    return $response->withHeader('Content-Type', 'text/html');
});

$app->group('/api/session', function (RouteCollectorProxy $group){

    // Login
    $group->get('/login', function (Request $request, Response $response) {
        
        $_SESSION["loggedIn"] = true;
        $_SESSION["isAdmin"] = true;
        $_SESSION["userID"] = 2;

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

    // Generic Status Return
    $group->get('', function (Request $request, Response $response) {
        $vars = stateVars();
        $response->getBody()->write($vars);
        // If header unassigned here, it would default to JSON and cause rendering errors
        return $response;
    });

});

function checkForSessionVars(){
    if(!isset($_SESSION["loggedIn"])){
        $_SESSION["loggedIn"] = false;
    };
    if(!isset($_SESSION["isAdmin"])){
        $_SESSION["isAdmin"] = false;
    };
    if(!isset($_SESSION["userID"])){
        $_SESSION["userID"] = null;
    };
}
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

    // Log into an account
    $group->post('/login', [UserIndex::class, 'validateUser']);
});

//Endpoint for getting all geographic location categories a player can assign to themselves.
$app->get('/api/regions', RegionIndex::class);

// Run app
$app->run();