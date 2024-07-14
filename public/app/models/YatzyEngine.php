<?php
namespace Yatzy;

require_once "Dice.php";
require_once "ScoreCard.php";
require_once "YatzyGame.php";
require_once "score.php";

use Yatzy\YatzyGame;

$_SESSION['game'] = null;
$_SESSION['score-card'] = null;

// By default, these are null

class YatzyEngine {
    public $game;
    public $scoreCard;
    public function __construct(){
        $this->resetGame();
    }

    function resetGame(){
        // echo "Creating new game.";
        $this->game = new YatzyGame();
        $this->scoreCard = new ScoreCard();
    }
}

$engine = new YatzyEngine();

if(isset($_GET['new-game'])) {
    $engine->resetGame();
}

if(isset($_GET['info'])) {
    var_export($engine->$game);
}