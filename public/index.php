<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
include("models/score.php");

require __DIR__ . '/../vendor/autoload.php';
session_start();

function jsonReply(Response $response, $data)
{
    $payload = json_encode($data);
    $response->getBody()->write($payload);
    return $response->withHeader('Content-Type', 'application/json');
}

$app = AppFactory::create();
$app->addBodyParsingMiddleware();


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
 * saves player name and score to session variable and returns the top 10 scores
 */
$app->post('/score', function(Request $request, Response $response, array $args) {
    $name = $request->getParsedBody()['name'];
    $score = $request->getParsedBody()['score'];

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

$app->run();
?>