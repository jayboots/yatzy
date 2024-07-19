<?php
namespace Yatzy;

require_once "Dice.php";
require_once "ScoreCard.php";

use Yatzy\Dice;

class YatzyGame {
    public $maxRolls;
    public $maxRounds;
    public $roundStart;
    public $activeHand;
    public $lockRoster;
    public $currentRound;
    public $rollsLeft;
    public $dice;
    public $scoreCard;

    public function __construct($maxRolls = 3, $maxRounds = 15) {

        $this->maxRolls = $maxRolls;
        $this->maxRounds = $maxRounds;
        $this->roundStart = 0;
        $this->activeHand = array_fill(0, 5, null);
        $this->lockRoster = array_fill(0, 5, false);
        $this->currentRound = $this->roundStart;
        $this->rollsLeft = $this->maxRolls;
        $this->dice = new Dice();
        $this->scoreCard = new ScoreCard();

    }

    public function updateLockRoster($lockRoster) {
        if ($this->rollsLeft < $this->maxRolls || $this->rollsLeft <= 0) {
            $this->lockRoster = $lockRoster;
        }
    }

    public function incrementRound() {
        if ($this->currentRound < $this->maxRounds) {
            if (($this->rollsLeft == $this->maxRolls) || in_array(null, $this->activeHand)) {
                return false;
            } else {
                $this->scoreCard->tallyScore();
                $this->currentRound += 1;
                $this->resetDice();
                return true;
            }
        }
    }

    public function resetDice() {
        $this->activeHand = array_fill(0, 5, null);
        $this->lockRoster = array_fill(0, 5, false);
        $this->rollsLeft = $this->maxRolls;
    }

    public function decrementRolls() {
        if ($this->rollsLeft > 0) {
            $this->rollsLeft -= 1;
        }
    }

    public function rollDice() {
        if ($this->rollsLeft > 0) {
            // echo "Rolling the dice.\n";
            $newSet = $this->dice->getNewHand();
            for ($i = 0; $i < count($this->lockRoster); $i++) {
                if ($this->lockRoster[$i] == false) {
                    $this->activeHand[$i] = $newSet[$i];
                }
            }
            $this->decrementRolls();
        }
    }

}
