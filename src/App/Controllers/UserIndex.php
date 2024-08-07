<?php

declare(strict_types=1);

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Repositories\UserRegistry;
use Valitron\Validator;

class UserIndex{

    public function __construct(private UserRegistry $userList, private Validator $validator){
    }

    // Makes a call to the UserRegistry class's getAllUsers() function and returns the result.
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
        // Rules
        $this->validator->mapFieldsRules([
            'username' => ['required', ['lengthMin', 4], 'alphaNum'],
            'first_name' => ['required', ['lengthMin', 1], 'alphaNum'],
            'last_name' => [['lengthMin', 1], 'alphaNum'],
            'password' => ['required', ['lengthMin', 4], 'alphaNum'],
            'region_id' => ['integer', ['min', 3], ['max', 9]]
            ]
        );

        $body = $request->getParsedBody();

        $this->validator = $this->validator->withData($body);

        if(!$this->validator->validate()){
            $response->getBody()->write(json_encode($this->validator->errors()));
            return $response->withStatus(422);
        }
        else{
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


    public function validateUser(Request $request, Response $response): Response
    {

        $body = $request->getParsedBody();

        $newUser = $this->userList->validateUser($body);

        if ($newUser == false){
            $body = json_encode([
                'message' => 'Could not validate user.'
            ]);

        }
        else{
            $body = json_encode([
                'message' => 'Validated user.',
                'entry' => $newUser
            ]);

            $_SESSION["loggedIn"] = true;
            if ($newUser[0]["type_id"] == "1" || $newUser[0]["type_id"] == 1){
                $_SESSION["isAdmin"] = true;
            }
            else{
                $_SESSION["isAdmin"] = false;
            }
            $_SESSION["userID"] = $newUser[0]["user_id"];
        }
        $response->getBody()->write($body);
        return $response->withStatus(201);
    }


    public function updateUser(Request $request, Response $response, string $id): Response
    {
        $this->validator->mapFieldsRules([
            'first_name' => [['lengthMin', 1], 'alphaNum'],
            'last_name' => [['lengthMin', 1], 'alphaNum'],
            'region_id' => ['integer', ['min', 3], ['max', 9]]
            ]
        );

        $body = $request->getParsedBody();

        $this->validator = $this->validator->withData($body);

        if(!$this->validator->validate()){
            $response->getBody()->write(json_encode($this->validator->errors()));
            return $response->withStatus(422);
        }
        else{
            $userInfo = $this->userList->updateUser($body, (int) $id);

            if ($userInfo == false){
                $body = json_encode([
                    'message' => 'Could not update this user.'
                ]);
            }
            else{
                $body = json_encode([
                    'message' => 'Updated user information.',
                    'entry' => $userInfo
                ]);
            }
            $response->getBody()->write($body);
            return $response->withStatus(200);
        }
    }

    public function deleteUser(Request $request, Response $response, string $id): Response
    {
        $deletedUser = $this->userList->deleteUser((int) $id);
        $body = json_encode([
            'message' => 'Deleted any user matching id=' . $id
        ]);

        $response->getBody()->write($body);
        
        return $response->withStatus(200);
    }
}