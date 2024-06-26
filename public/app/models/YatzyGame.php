<?php
require_once "dice.php";

class YatzyGame {
    private $maxRolls;
    private $maxRounds;
    private $roundStart;
    private $score;
    private $activeHand;
    private $lockRoster;
    private $currentRound;
    private $rollsLeft;

    public function __construct($maxRolls = 3, $maxRounds = 15) {
        $this->maxRolls = $maxRolls;
        $this->maxRounds = $maxRounds;
        $this->roundStart = 0;
        $this->score = 0;
        $this->activeHand = array_fill(0, 5, null);
        $this->lockRoster = array_fill(0, 5, 0);
        $this->currentRound = $this->roundStart;
        $this->rollsLeft = $this->maxRolls;
    }

    public function updateLockRoster($lockRoster) {
        if ($this->rollsLeft < $this->maxRolls || $this->rollsLeft <= 0) {
            echo "Updating the lock roster: " . implode(", ", $lockRoster) . "\n";
            $this->lockRoster = $lockRoster;
        } else {
            echo "Locking the dice is disabled on this turn.\n";
        }
    }

    public function incrementRound() {
        if ($this->currentRound < $this->maxRounds) {
            if (($this->rollsLeft == $this->maxRolls) || in_array(null, $this->activeHand)) {
                echo "Need to roll the dice at least once before a round can end.\n";
                return false;
            } else {
                $this->currentRound += 1;
                $this->resetDice();
                return true;
            }
        } else {
            echo "The current round cannot exceed the maximum number of rounds.\n";
            return false;
        }
    }

    public function resetDice() {
        echo "Resetting all dice, rolls, and lock states.\n";
        $this->activeHand = array_fill(0, 5, null);
        $this->lockRoster = array_fill(0, 5, 0);
        $this->rollsLeft = $this->maxRolls;
    }

    public function decrementRolls() {
        if ($this->rollsLeft > 0) {
            $this->rollsLeft -= 1;
            echo "You have " . $this->rollsLeft . " re-rolls left.\n";
        } else {
            echo "No re-rolls left. Make score choice and end turn.\n";
        }
    }

    public function rollDice() {
        if ($this->rollsLeft > 0) {
            echo "Rolling the dice.\n";
            $newSet = getNewHand();
            for ($i = 0; $i < count($this->lockRoster); $i++) {
                if ($this->lockRoster[$i] == 0) {
                    $this->activeHand[$i] = $newSet[$i];
                } else {
                    echo "Die # " . ($i + 1) . " is locked.\n";
                }
            }
            $this->decrementRolls();
            return true;
        } else {
            echo "Cannot roll dice. No more rolls left.\n";
            return false;
        }
    }
}

