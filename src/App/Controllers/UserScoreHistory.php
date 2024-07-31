<?php

declare(strict_types=1);

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Repositories\Leaderboard;

class UserScoreHistory{

    public function __construct(private Leaderboard $leaderboard){

    }
    public function __invoke(Request $request, Response $response, string $id)
    {
        //Reminder: Attribute name "score_history" is set up in the middleware GetUserScores class
        $result = $request->getAttribute('score_history');

        $body = json_encode($result);
        $response->getBody()->write($body);
    
        return $response;
    }
}