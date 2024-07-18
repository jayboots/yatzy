<?php
namespace Yatzy;

require_once "Dice.php";
require_once "ScoreCard.php";
require_once "YatzyGame.php";
require_once "score.php";

use Yatzy\YatzyGame;

session_start();

class YatzyEngine {
    public $game;
    public $scoreCard;
    public $gameOver;
    public function __construct(){
        $this->game = null;
        $this->scoreCard = null;
        $this->gameOver = true;
        // $this->resetGame(); // no active game by default!
    }

    public function resetGame(){
        // echo "Creating new game.";
        $this->game = new YatzyGame();
        $this->scoreCard = new ScoreCard();
        $this->gameOver = false;
    }


    public function rollDice($lockRoster){
        if (!empty($this->game)){
            $this->game->lockRoster = $lockRoster;
            $this->game->rollDice();
        }
    }

    public function endRound(){
        if (!empty($this->game)){
            // return $this->game->activeHand;

            // $game->incrementRound();
            // // TODO: "Lock in" the scoreboard here
            // updateScoreCard(); // commit the selected score to the scorecard
            // $targetChoice = null;
            // $targetPts = null;

            // if ($game->currentRound == $game->maxRounds) {
            //     $gameOver = true;
            //     $bonus = $scoreCard->calculateBonus();
            //     $game->score += $bonus;
            //     $rollBtn->disabled = true; // Can't roll dice if the game is over.
            //     // echo "GAME IS OVER. Can make a new game, if you want."
            //     if ($bonus != 0) {
            //         echo "Game over! Bonus 50 pts!";
            //         echo "Total score: " . $game->score;
            //     } else {
            //         echo "Game over!";
            //     }
            // } else {
            //     $game->resetDice(); // new round = new dice, new rolls, no locks
            //     $canRoll = true;
            //     drawDice($game->activeHand); // draw the reset
            //     drawLocks($game->lockRoster); // draw the locks here, when implemented
            //     $rollBtn->disabled = false; // We're starting a new round so we need to be able to roll
            // }
            // // redraw the scorecard regardless of if final turn or not.
            // drawScoreCard();
        }
    }
}

if(isset($_GET['new-game'])) {
    //$engine->resetGame();
    // http_response_code(201);
    $_SESSION["engine"] = new YatzyEngine();
    $_SESSION["engine"]->resetGame();
    header('Content-Type: application/json');
    echo json_encode($_SESSION["engine"]);
}

if(isset($_GET['info'])) {
    header('Content-Type: application/json');
    // echo json_encode(var_export($engine));
    echo json_encode($_SESSION["engine"]);
}

if(isset($_GET['roll-dice'])) {
    header('Content-Type: application/json');
    // echo json_encode($_SESSION["engine"]->rollDice());
    $_SESSION["engine"]->rollDice();
    echo json_encode($_SESSION["engine"]);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $payload = json_decode(file_get_contents("php://input"), true);
    if (!empty($payload)){
        // if we have lock data
        if(isset($payload["locks"])){
            $_SESSION["engine"]->rollDice($payload["locks"]);
            header('Content-Type: application/json');
            echo json_encode($_SESSION["engine"]);
        }

        // Handle round end and score updating
        if(isset($payload["selection"])){
            // $_SESSION["selectRoster"] =  $payload[0];
            // $_SESSION["choice"] =  $payload[1];
            // Echo it back to me for now
            header('Content-Type: application/json');
            echo json_encode($payload["selection"]);
        }
    }
}