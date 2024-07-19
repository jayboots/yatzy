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
                $array = str_split($stringDice);
                $amt = 1;
                foreach ($array as $die) {
                    if ($die == $amt) {
                        $pts += $amt;
                    }
                }
                break;
            case "twos":
                $array = str_split($stringDice);
                $amt = 2;
                foreach ($array as $die) {
                    if ($die == $amt) {
                        $pts += $amt;
                    }
                }
                break;
            case "threes":
                $array = str_split($stringDice);
                $amt = 3;
                foreach ($array as $die) {
                    if ($die == $amt) {
                        $pts += $amt;
                    }
                }
                break;
            case "fours":
                $array = str_split($stringDice);
                $amt = 4;
                foreach ($array as $die) {
                    if ($die == $amt) {
                        $pts += $amt;
                    }
                }
                break;
            case "fives":
                $array = str_split($stringDice);
                $amt = 5;
                foreach ($array as $die) {
                    if ($die == $amt) {
                        $pts += $amt;
                    }
                }
                break;
            case "sixes":
                $array = str_split($stringDice);
                $amt = 6;
                foreach ($array as $die) {
                    if ($die == $amt) {
                        $pts += $amt;
                    }
                }
                break;
            case "onePair":
                // Two dice showing the same number. Score: Sum of those two dice
                if (strlen($stringDice) == 2){
                    $pattern = '/(\d)\1/';
                    $outcomes = preg_match_all($pattern, $stringDice, $matches);
                    if ($outcomes) {
                        $array = str_split($stringDice);
                        // $pts = $array[0] * 2;
                        $pts = array_sum($array);
                    }
                }
                // TODO: Could add robustness to accept more than 2 dice... would be nice.
                break;
            case "twoPairs":
                if (strlen($stringDice) == 4){
                    $pattern = '/(?<first>(?<f>\d)(\k<f>)).*?(?!\k<f>)(?<second>(?<s>\d)(\k<s>))/';
                    $outcomes = preg_match_all($pattern, $stringDice, $matches);
                    if ($outcomes) {
                        $array = str_split($stringDice);
                        $pts = array_sum($array);
                    }
                }
                break;
            case "threeKind":
                if (strlen($stringDice) == 3){
                    $pattern = '/(\d)\1{2}/';
                    $outcomes = preg_match_all($pattern, $stringDice, $matches);
                    if ($outcomes) {
                        $array = str_split($stringDice);
                        $pts = array_sum($array);
                    }
                }
                break;
            case "fourKind":
                if (strlen($stringDice) == 4){
                    $pattern = '/(\d)\1{3}/';
                    $outcomes = preg_match_all($pattern, $stringDice, $matches);
                    if ($outcomes) {
                        $array = str_split($stringDice);
                        $pts = array_sum($array);
                    }
                }
                break;
            case "smallStraight":
                // The combination 1-2-3-4-5. Score: 15 points (sum of all the dice)
                $pattern = '/(12345)/';
                $outcomes = preg_match_all($pattern, $stringDice, $matches);
                if ($outcomes) {
                    $array = str_split($stringDice);
                    $pts = array_sum($array);
                }
                break;
            case "largeStraight":
                // The combination 2-3-4-5-6. Score: 20 points (sum of all the dice).
                $pattern = "/(23456)/";
                $outcomes = preg_match_all($pattern, $stringDice, $matches);
                if ($outcomes) {
                    $array = str_split($stringDice);
                    $pts = array_sum($array);
                }
                break;
            case "fullHouse":
                if (strlen($stringDice) == 5){
                    $pattern = "/(?<first>\d)(\k<first>){2}\d?(?<second>(?!\k<first>)\d)(\k<second>)|(?<third>\d)(\k<third>)\d?(?<fourth>(?!\k<third>)\d)(\k<fourth>){2}/";
                    $outcomes = preg_match_all($pattern, $stringDice, $matches);
                    if ($outcomes) {
                        $array = str_split($stringDice);
                        $pts = array_sum($array);
                    }
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
}