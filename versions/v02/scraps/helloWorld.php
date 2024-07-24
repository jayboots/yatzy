<?php

//NOTE: This file was used to debug the 'PHP Slim\Exception\HttpNotFoundException 404 Not Found' problem and will be moved to scraps prior to submission.
// See this for more details, but not a necessary read since problem is fixed. https://stackoverflow.com/questions/70637856/php-slim-exception-httpnotfoundexception-404-not-found-and-nothing-is-helping

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Selective\BasePath\BasePathMiddleware;
use Slim\Factory\AppFactory;

require_once __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

// Add Slim routing middleware
$app->addRoutingMiddleware();

// Set the base path to run the app in a subdirectory.
// This path is used in urlFor().
$app->add(new BasePathMiddleware($app));

$app->addErrorMiddleware(true, true, true);

// Define app routes
$app->get('/', function (Request $request, Response $response) {
    $response->getBody()->write('Hello, World!');
    return $response;
})->setName('root');

// Run app
$app->run();