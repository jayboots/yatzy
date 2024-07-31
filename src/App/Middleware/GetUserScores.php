<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Routing\RouteContext;
use App\Repositories\Leaderboard;
use Slim\Exception\HttpNotFoundException;

class GetUserScores {

    public function __construct(private Leaderboard $leaderboard){

    }
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $context = RouteContext::fromRequest($request);
        $route = $context->getRoute();
        $id = $route->getArgument('user_id');

        $result = $this->leaderboard->getUserScoreHistory((int) $id);
    
        if ($result === false){
            throw new HttpNotFoundException($request, message: 'No play history found for the provided user ID.');
        }

        $request = $request->withAttribute('score_history', $result);
        $response = $handler->handle($request);

        return $response;
    }
}