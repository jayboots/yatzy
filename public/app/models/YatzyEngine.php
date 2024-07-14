<?php
namespace Yatzy;

require_once "Dice.php";
require_once "ScoreCard.php";
require_once "YatzyGame.php";
require_once "score.php";

use Yatzy\YatzyGame;

$game = new YatzyGame();

header('Content-Type: application/json');
echo json_encode(var_dump($game));