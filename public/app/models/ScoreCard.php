<?php
namespace Yatzy;
class ScoreCard {
    public $records;
    public $score;
    public $totalScore;
    public $bonus;
    public $bonusThreshold;

    public function __construct() {
        $this->records = array(
            "ones" => null,
            "twos" => null,
            "threes" => null,
            "fours" => null,
            "fives" => null,
            "sixes" => null,
            "onePair" => null,
            "twoPairs" => null,
            "threeKind" => null,
            "fourKind" => null,
            "smallStraight" => null,
            "largeStraight" => null,
            "fullHouse" => null,
            "chance" => null,
            "yatzy" => null
        );
        $this->score = 0;
        $this->totalScore = 0;
        $this->bonus = 0;
        $this->bonusThreshold = 63;
    }

    public function calculateBonus() {
        $firstSectionTotal = $this->records["ones"]
            + $this->records["twos"]
            + $this->records["threes"]
            + $this->records["fours"]
            + $this->records["fives"]
            + $this->records["sixes"];

        // If the threshold is met and the bonus has not yet been applied
        if ($firstSectionTotal >= $this->bonusThreshold && $this->bonus == 0) {
            $this->bonus = 50;
            $this->totalScore = ($this->score + $this->bonus);
        }
    }

    public function tallyScore() {
        $this->score = 0;
        foreach ($this->records as $key => $value) {
            $this->score += $value;
        }
    }
}
