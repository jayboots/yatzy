<?php

declare(strict_types=1);

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Repositories\UserRegistry;

class UserIndex{

    public function __construct(private UserRegistry $userList){

    }
    public function getAllUsers(Request $request, Response $response)
    {

        $body = json_encode($this->userList->getAllUsers());
        $response->getBody()->write($body);

        return $response;
    }

    public function getUser(Request $request, Response $response, string $id)
    {
        //Reminder: Attribute name "user" is set up in the middleware GetUser class
        $result = $request->getAttribute('user'); 

        $body = json_encode($result);
        $response->getBody()->write($body);
    
        return $response;
    }

    public function addNewUser(Request $request, Response $response): Response
    {
        $body = $request->getParsedBody();

        $newUser = $this->userList->addNewUser($body);

        if ($newUser == false){
            $body = json_encode([
                'message' => 'Could not create new user.'
            ]);
        }
        else{
            $body = json_encode([
                'message' => 'New user account created.',
                'entry' => $newUser
            ]);
        }


        $response->getBody()->write($body);
        return $response->withStatus(201);
    }
}