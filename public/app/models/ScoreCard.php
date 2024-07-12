<?php
namespace Yatzy;
class ScoreCard {
    private $records = array(
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
    private $bonus = 0;
    private $bonusThreshold = 63;

    public function calculateBonus() {
        $firstSectionTotal = $this->records["ones"]
            + $this->records["twos"]
            + $this->records["threes"]
            + $this->records["fours"]
            + $this->records["fives"]
            + $this->records["sixes"];
        if ($firstSectionTotal >= $this->bonusThreshold && $this->bonus == 0) {
            $this->bonus = 50;
        } else {
            // echo "First six sum score: " . $firstSectionTotal . "\n";
            // echo "No bonus...\n";
        }
        return $this->bonus;
    }
}
