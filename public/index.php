<?php

declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Selective\BasePath\BasePathMiddleware;
use Slim\Factory\AppFactory;
use DI\ContainerBuilder; //Dependency Injector

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
 * Endpoint for the top 10 leaderboard data
 */
$app->get('/api/leaderboard', function (Request $request, Response $response) {

    // $db = new App\Database;
    // $leaderboard = new App\Repositories\Leaderboard($db);

    // Dependency injection allows for the $db requirement for the leaderboard class
    // to be resolved automatically, replacing the above code.
    $leaderboard = $this->get(App\Repositories\Leaderboard::class); 
    $body = json_encode($leaderboard->getTop10());
    $response->getBody()->write($body);

    return $response;
});

/**
 * Endpoint for all scores, for admin purposes
 */
$app->get('/api/scores', function (Request $request, Response $response) {

    $leaderboard = $this->get(App\Repositories\Leaderboard::class); 
    $body = json_encode($leaderboard->getAllScores());
    $response->getBody()->write($body);

    return $response;
});


/**
 * Endpoint for all users
 */
$app->get('/api/users', function (Request $request, Response $response) {

    $userList = $this->get(App\Repositories\UserRegistry::class); 
    $body = json_encode($userList->getAllUsers());
    $response->getBody()->write($body);

    return $response;
});

/**
 * Endpoint for a specific user's score, for user profile play history
 */
$app->get('/api/scores/{user_id}', function (Request $request, Response $response,  array $args) {

    $id = $args['user_id'];
    $leaderboard = $this->get(App\Repositories\Leaderboard::class); 
    $body = json_encode($leaderboard->getUserScoreHistory($id));
    $response->getBody()->write($body);

    return $response;
});

/**
 * Endpoint for a specific user's info, for a non-admin profile purposes
 */
$app->get('/api/users/{user_id}', function (Request $request, Response $response, array $args) {

    $id = $args['user_id'];
    $userList = $this->get(App\Repositories\UserRegistry::class); 
    $body = json_encode($userList->getUser($id));
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

// Run app
$app->run();