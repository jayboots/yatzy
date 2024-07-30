<?php

declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Selective\BasePath\BasePathMiddleware;
use Slim\Factory\AppFactory;
use DI\ContainerBuilder; //Dependency Injector
use Slim\Handlers\Strategies\RequestResponseArgs;

require_once __DIR__ . '/../vendor/autoload.php';

// Configure application with dependency injector container
$builder = new ContainerBuilder;
$container = $builder->addDefinitions(__DIR__ . "/../config/definitions.php")->build();
AppFactory::setContainer($container);

session_start();

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
 * Establish the app root.
 */
$app->get('/', function (Request $request, Response $response, array $args) {
    $view = file_get_contents("index.html");
    // include 'app/navbar.php';
    $response->getBody()->write($view);
    return $response;
});


/**
 * TODO: Login
 */
$app->get('api/login/{username:[0-9]+}/{password}', function (Request $request, Response $response, string $username, string $password) {

    $records = $this->get(App\Repositories\UserRegistry::class);
    $result = $records->login((string) $username, (string) $password); //function that does something to validate the info given against the records in the DB
    if ($result === false){
        // Don't want to throw an error here necessarily, but leaving for now.
        throw new \Slim\Exception\HttpNotFoundException($request, message: 'Could not log in.');
    }
    else {
        // Set the session variables is_logged_in, is_admin, and user_id
        $body = json_encode($result);
        $response->getBody()->write($body);
    
        return $response->withHeader('Content-Type', 'application/json');
    }
});

// TODO: Logout
$app->get('/logout', function (Request $request, Response $response) {
    // Reset the session variables is_logged_in, is_admin, and user_id
    // Call an AJAX request to reset the page / navbar?
});

/**
 * Endpoint for the top 10 leaderboard data
 */
$app->get('/api/leaderboard', function (Request $request, Response $response) {

    $leaderboard = $this->get(App\Repositories\Leaderboard::class); 
    $body = json_encode($leaderboard->getTop10());
    $response->getBody()->write($body);

    return $response->withHeader('Content-Type', 'application/json');
});

/**
 * Endpoint for all scores, for admin purposes
 */
$app->get('/api/scores', function (Request $request, Response $response) {

    $leaderboard = $this->get(App\Repositories\Leaderboard::class); 
    $body = json_encode($leaderboard->getAllScores());
    $response->getBody()->write($body);

    return $response->withHeader('Content-Type', 'application/json');
});


/**
 * Endpoint for all users
 */
$app->get('/api/users', function (Request $request, Response $response) {

    $userList = $this->get(App\Repositories\UserRegistry::class); 
    $body = json_encode($userList->getAllUsers());
    $response->getBody()->write($body);

    return $response->withHeader('Content-Type', 'application/json');
});

/**
 * Endpoint for a specific user's score, for user profile play history
 */
$app->get('/api/scores/{user_id:[0-9]+}', function (Request $request, Response $response, string $id) {

    $leaderboard = $this->get(App\Repositories\Leaderboard::class);
    $result = $leaderboard->getUserScoreHistory((int) $id);

    if ($result === false){
        throw new \Slim\Exception\HttpNotFoundException($request, message: 'Could not retrieve score history for this user.');
    }

    $body = json_encode($result);
    $response->getBody()->write($body);

    return $response->withHeader('Content-Type', 'application/json');
});

/**
 * Endpoint for a specific user's info, for a non-admin profile purposes
 */
$app->get('/api/users/{user_id:[0-9]+}', function (Request $request, Response $response, string $id) {

    $userList = $this->get(App\Repositories\UserRegistry::class); 
    $result = $userList->getUser((int) $id);

    if ($result === false){
        throw new \Slim\Exception\HttpNotFoundException($request, message: 'Could not find such a user.');
    }

    $body = json_encode($result);
    $response->getBody()->write($body);

    return $response->withHeader('Content-Type', 'application/json');
});


/**
 * Endpoint for getting a list of all the possible geographic regions a player can assign to themselves
 */
$app->get('/api/regions', function (Request $request, Response $response) {

    $regionList = $this->get(App\Repositories\RegionRegistry::class); 
    $body = json_encode($regionList->getRegions());
    $response->getBody()->write($body);

    return $response->withHeader('Content-Type', 'application/json');
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

// Run app
$app->run();