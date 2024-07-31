<?php

declare(strict_types=1);

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Repositories\Leaderboard;

class LeaderIndex{

    public function __construct(private Leaderboard $leaderboard){

    }
    public function __invoke(Request $request, Response $response)
    {
        $body = json_encode($this->leaderboard->getTop10());
        $response->getBody()->write($body);

        return $response;
    }
}