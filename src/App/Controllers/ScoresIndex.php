<?php

declare(strict_types=1);

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Repositories\Leaderboard;

class ScoresIndex{

    public function __construct(private Leaderboard $leaderboard){

    }
    public function getAllScores(Request $request, Response $response)
    {
        $body = json_encode($this->leaderboard->getAllScores());
        $response->getBody()->write($body);

        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getTop10(Request $request, Response $response)
    {
        $body = json_encode($this->leaderboard->getTop10());
        $response->getBody()->write($body);

        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getUserScores(Request $request, Response $response, string $id)
    {
        //Reminder: Attribute name "score_history" is set up in the middleware GetUserScores class
        $result = $request->getAttribute('score_history');

        $body = json_encode($result);
        $response->getBody()->write($body);
    
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function addNewScore(Request $request, Response $response): Response
    {
        $body = $request->getParsedBody();

        $newScore = $this->leaderboard->addNewScore($body);

        $body = json_encode([
            'message' => 'Score added.',
            'entry' => $newScore
        ]);
        $response->getBody()->write($body);
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }

    public function deleteRecord(){
        // TO IMPLEMENT
    }
}