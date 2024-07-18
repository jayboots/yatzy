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
                // TODO: robustness to accept more than 2 dice... would be nice.
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
            // case "threeKind":
            //     if (count($selectedHand) == 3){
            //         $pattern = '/(\d)\1{2}/';
            //         $outcomes = preg_match_all($pattern, $stringDice, $matches);
            //         if ($outcomes) {
            //             $pts = array_sum($selectedHand);
            //             echo "This will give you " . $pts . " points!";
            //         }
            //         else{
            //             echo $noMatchMsg;
            //         }
            //     }
            //     else{
            //         echo "You need to select three dice to score three of a kind.";
            //     }
            //     break;
            // case "fourKind":
            //     if (count($selectedHand) == 4){
            //         $pattern = '/(\d)\1{3}/';
            //         $outcomes = preg_match_all($pattern, $stringDice, $matches);
            //         if ($outcomes) {
            //             $pts = array_sum($selectedHand);
            //             echo "This will give you " . $pts . " points!";
            //         }
            //         else{
            //             echo $noMatchMsg;
            //         }
            //     }
            //     else{
            //         echo "You need to select four dice to score four of a kind.";
            //     }
            //     break;
            // case "smallStraight":
            //     // The combination 1-2-3-4-5. Score: 15 points (sum of all the dice)
            //     $pattern = '/(12345)/';
            //     $outcomes = preg_match_all($pattern, $stringDice, $matches);
            //     if ($outcomes){
            //         $pts=15;
            //         echo $matches[0][0] . " gives you a small straight, and " . $pts . " points!";
            //     }
            //     else{
            //         echo $noMatchMsg;
            //     }
            //     break;
            // case "largeStraight":
            //     // The combination 2-3-4-5-6. Score: 20 points (sum of all the dice).
            //     $pattern = "/(23456)/";
            //     $outcomes = preg_match_all($pattern, $stringDice, $matches);
            //     if ($outcomes) {
            //         $pts = 20;
            //         echo $matches[0][0] . " gives you a large straight, and " . $pts . " points!";
            //     } else {
            //         echo $noMatchMsg;
            //     }
            //     // echo $outcomes;
            //     break;
            // case "fullHouse":
            //     if (count($selectedHand) == 5) {
            //         $pattern = "/(?<first>\d)(\k<first>){2}\d?(?<second>(?!\k<first>)\d)(\k<second>)|(?<third>\d)(\k<third>)\d?(?<fourth>(?!\k<third>)\d)(\k<fourth>){2}/";
            //         $outcomes = preg_match_all($pattern, $stringDice, $matches);
            //         if ($outcomes) {
            //             $pts = array_sum($selectedHand);
            //             echo "This will give you " . $pts . " points!";
            //         } else {
            //             echo $noMatchMsg;
            //         }
            //     } else {
            //         echo "You need to select five dice to submit a full house.";
            //     }
            //     break;
            // case "chance":
            //     //Any combination of dice. Score: Sum of all the dice.
            //     $pts = array_sum($selectedHand);
            //     echo "This will give you " . $pts . " points";
            //     break;
            // case "yatzy":
            //     if (count($selectedHand) == 5) {
            //         $pattern = "/(\d)\1{4}/";
            //         $outcomes = preg_match_all($pattern, $stringDice, $matches);
            //         if ($outcomes) {
            //             $pts = 50;
            //             echo $matches[0][0] . " gives you a yatzy! And 50 pts! Congrats";
            //         } else {
            //             echo $noMatchMsg;
            //         }
            //     } else {
            //         echo "You need to select five dice to submit a yatzy.";
            //     }
            //     break;
            // default:
            //     echo "Something went wrong. You selected: " . $scoreChoice;
            //     // code block
            //     break;
        }

        return $pts;
    }

}
