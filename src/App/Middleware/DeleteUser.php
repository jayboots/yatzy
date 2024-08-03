<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Routing\RouteContext;
use App\Repositories\UserRegistry;
use Slim\Exception\HttpNotFoundException;

class DeleteUser {

    public function __construct(private UserRegistry $userList){
        // See UserRegistry class for associated SQL queries and functions on this endpoint
    }
    public function __invoke(Request $request, RequestHandler $handler): Response
    {
        $context = RouteContext::fromRequest($request);
        $route = $context->getRoute();
        $id = $route->getArgument('user_id');

        $result = $this->userList->deleteUser((string) $id);
    
        if ($result === false){
            throw new HttpNotFoundException($request, message: 'Could not find such a user.');
        }

        // Here we assign the attribute the name 'user'
        $request = $request->withAttribute('user', $result);
        $response = $handler->handle($request);

        return $response;
    }
}