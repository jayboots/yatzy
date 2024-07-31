<?php

declare(strict_types=1);

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Repositories\RegionRegistry;

class RegionIndex{

    public function __construct(private RegionRegistry $regionList){

    }
    public function __invoke(Request $request, Response $response)
    {

        $body = json_encode($this->regionList->getRegions());
        $response->getBody()->write($body);

        return $response;
    }
}