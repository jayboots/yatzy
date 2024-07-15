<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Selective\BasePath\BasePathMiddleware;
use Slim\Factory\AppFactory;

// https://github.com/selective-php/basepath
// https://stackoverflow.com/questions/70637856/php-slim-exception-httpnotfoundexception-404-not-found-and-nothing-is-helping

include("app/models/score.php");

require_once __DIR__ . '/../vendor/autoload.php';

session_start();

function jsonReply(Response $response, $data)
{
    $payload = json_encode($data);
    $response->getBody()->write($payload);
    return $response->withHeader('Content-Type', 'application/json');
}

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

// Define app routes for testing - will want to assign root to above
// $app->get('/', function (Request $request, Response $response) {
//     $response->getBody()->write('Hello, World!');
//     return $response;
// })->setName('root');

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