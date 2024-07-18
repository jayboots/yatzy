<?php
namespace Yatzy;

// require_once "Dice.php";
// require_once "ScoreCard.php";
require_once "YatzyGame.php";
require_once "score.php";

use Yatzy\YatzyGame;

session_start();

class YatzyEngine {
    public $game;
    // public $gameOver;
    public function __construct(){
        $this->game = null;
        // $this->gameOver = true;
        // $this->resetGame(); // no active game by default!
    }

    public function resetGame(){
        $this->game = new YatzyGame();
        // $this->gameOver = false;
    }

    public function rollDice($lockRoster){
        if (!empty($this->game)){
            $this->game->lockRoster = $lockRoster;
            $this->game->rollDice();
        }
    }

    public function processScore($selectRoster, $scoreChoice) {
        if (!empty($this->game) && !empty($this->game->scoreCard)){

            // Check if the scorecard is NULL for the choice
            if ($this->game->scoreCard->records[$scoreChoice]==null){

                // Create the sub-selection
                $selectedHand = array();
                for ($i = 0; $i < 5; $i++) {
                    if ($selectRoster[$i]){
                        $selectedHand[] = $this->game->activeHand[$i];
                    }
                }

                // Create a sorted string
                sort($selectedHand);
                $stringDice = implode("", $selectedHand);

                // Calculate the score
                $pts = $this->game->scoreCard->calculateScore($scoreChoice, $stringDice);

                // Update the scoreboard
                $this->game->scoreCard->records[$scoreChoice] = $pts;
                // // Increment the round
                $this->game->incrementRound();
            }
            else {
                // Space not free! :(
                return http_response_code(208);
            }
            // If successful, update and increment round
        }
        else {
            // Otherwise, nothing changes. Return a response code and have the UI respond accordingly... i.e. allow another try. 
            return http_response_code(400);
        }
    }
}

if(isset($_GET['new-game'])) {
    $_SESSION["engine"] = new YatzyEngine();
    $_SESSION["engine"]->resetGame();
    header('Content-Type: application/json');
    echo json_encode($_SESSION["engine"]);
}

if(isset($_GET['info'])) {
    header('Content-Type: application/json');
    echo json_encode($_SESSION["engine"]);
}

// TODO: Call for Bonus
// if(isset($_GET['game-over'])) {
//     $_SESSION["engine"]->game->scoreCard->calculateBonus();
//     header('Content-Type: application/json');
//     echo json_encode($_SESSION["engine"]);
// }

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

            $_SESSION["engine"]->processScore($payload["selection"][0], $payload["selection"][1]);

            // Echo it back to me for now
            header('Content-Type: application/json');
            echo json_encode($_SESSION["engine"]);
        }
    }
}