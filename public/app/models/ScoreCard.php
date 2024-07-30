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
        }
        $this->totalScore = $this->score + $this->bonus;
    }

    public function tallyScore() {
        $this->score = 0;
        foreach ($this->records as $key => $value) {
            $this->score += $value;
        }
    }

    public function calculateScore($scoreChoice, $stringDice){
        $pts = 0;
        switch ($scoreChoice) {
            case "ones":
                $pts = $this->valueTally($stringDice, 1);
                break;
            case "twos":
                $pts = $this->valueTally($stringDice, 2);
                break;
            case "threes":
                $pts = $this->valueTally($stringDice, 3);
                break;
            case "fours":
                $pts = $this->valueTally($stringDice, 4);
                break;
            case "fives":
                $pts = $this->valueTally($stringDice, 5);
                break;
            case "sixes":
                $pts = $this->valueTally($stringDice, 6);
                break;
            case "onePair":
                if (strlen($stringDice) == 2){
                    $pattern = '/(\d)\1/';
                    $pts = $this->sumPatternMatch($pattern, $stringDice);
                }
                break;
            case "twoPairs":
                if (strlen($stringDice) == 4){
                    $pattern = '/(?<first>(?<f>\d)(\k<f>)).*?(?!\k<f>)(?<second>(?<s>\d)(\k<s>))/';
                    $pts = $this->sumPatternMatch($pattern, $stringDice);
                }
                break;
            case "threeKind":
                if (strlen($stringDice) == 3){
                    $pattern = '/(\d)\1{2}/';
                    $pts = $this->sumPatternMatch($pattern, $stringDice);
                }
                break;
            case "fourKind":
                if (strlen($stringDice) == 4){
                    $pattern = '/(\d)\1{3}/';
                    $pts = $this->sumPatternMatch($pattern, $stringDice);
                }
                break;
            case "smallStraight":
                // The combination 1-2-3-4-5. Score: 15 points (sum of all the dice)
                $pattern = '/(12345)/';
                $pts = $this->sumPatternMatch($pattern, $stringDice);
                break;
            case "largeStraight":
                // The combination 2-3-4-5-6. Score: 20 points (sum of all the dice).
                $pattern = "/(23456)/";
                $pts = $this->sumPatternMatch($pattern, $stringDice);
                break;
            case "fullHouse":
                if (strlen($stringDice) == 5){
                    $pattern = "/(?<first>\d)(\k<first>){2}\d?(?<second>(?!\k<first>)\d)(\k<second>)|(?<third>\d)(\k<third>)\d?(?<fourth>(?!\k<third>)\d)(\k<fourth>){2}/";
                    $pts = $this->sumPatternMatch($pattern, $stringDice);
                }
                break;
            case "chance":
                $array = str_split($stringDice);
                $pts = array_sum($array);
                break;
            case "yatzy":
                $pattern = '/(\d)\1{4}/';
                $outcomes = preg_match_all($pattern, $stringDice, $matches);
                if ($outcomes) {
                    $pts = 50;
                }
                break;
        }
        return $pts;
    }

    // Tally function for the "upper six", returns the sum of dice of a specified amount
    private function valueTally($stringDice, $amt){
        $array = str_split($stringDice);
        $pts = 0;
        foreach ($array as $die) {
            if ($die == $amt) {
                $pts += $amt;
            }
        }
        return $pts;
    }

    // Tally function for score options where the returned pts are the sum of all dice and there is a regex pattern match requirement.
    // i.e. all except first six, chance, and yatzy
    private function sumPatternMatch($pattern, $stringDice){
        $pts = 0;
        $outcomes = preg_match_all($pattern, $stringDice, $matches);
        if ($outcomes) {
            $array = str_split($stringDice);
            $pts = array_sum($array);
        }
        return $pts;
    }
}