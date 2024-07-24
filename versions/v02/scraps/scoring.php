<?php

// Update the selected hand
$selectedHand = array();
for ($i = 0; $i < 5; $i++) {
    if ($selectRoster[$i]){
        $selectedHand[] = $game->activeHand[$i];
    }
}

$scoreChoice = $this->id;
$pts = 0;
$stringDice = implode("", sort($selectedHand));
$pattern = null;
$outcomes = null;

$noMatchMsg = "No match. 0 pts for this one...";

// Scoring Here
switch ($scoreChoice) {
    case "ones":
        $pts = 0;
        foreach ($selectedHand as $die) {
            if ($die == 1) {
                $pts += 1;
            }
        }
        if ($pts == 0) {
            echo $noMatchMsg;
        } else {
            echo "This will give you " . $pts . " points!";
        }
        break;
    case "twos":
        $pts = 0;
        foreach ($selectedHand as $die) {
            if ($die == 2) {
                $pts += 2;
            }
        }
        if ($pts == 0) {
            echo $noMatchMsg;
        } else {
            echo "This will give you " . $pts . " points!";
        }
        break;
    case "threes":
        $pts = 0;
        foreach ($selectedHand as $die) {
            if ($die == 3) {
                $pts += 3;
            }
        }
        if ($pts == 0) {
            echo $noMatchMsg;
        } else {
            echo "This will give you " . $pts . " points!";
        }
        break;
    case "fours":
        $pts = 0;
        foreach ($selectedHand as $die) {
            if ($die == 4) {
                $pts += 4;
            }
        }
        if ($pts == 0) {
            echo $noMatchMsg;
        } else {
            echo "This will give you " . $pts . " points!";
        }
        break;
    case "fives":
        $pts = 0;
        foreach ($selectedHand as $die) {
            if ($die == 5) {
                $pts += 5;
            }
        }
        if ($pts == 0) {
            echo $noMatchMsg;
        } else {
            echo "This will give you " . $pts . " points!";
        }
        break;
    case "sixes":
        $pts = 0;
        foreach ($selectedHand as $die) {
            if ($die == 6) {
                $pts += 6;
            }
        }
        if ($pts == 0) {
            echo $noMatchMsg;
        } else {
            echo "This will give you " . $pts . " points!";
        }
        break;
    case "onePair":
        // Two dice showing the same number. Score: Sum of those two dice
        if (count($selectedHand) == 2){
            $pattern = '/(\d)\1/';
            $outcomes = preg_match_all($pattern, $stringDice, $matches);
            if ($outcomes) {
                $pts = array_sum($selectedHand);
                echo "This will give you " . $pts . " points!";
            }
            else{
                echo $noMatchMsg;
            }
        }
        else{
            echo "You need to select *exactly* two dice to submit a pair!";
        }
        break;
    case "twoPairs":
        if (count($selectedHand) == 4){
            $pattern = '/(?<first>(?<f>\d)(\k<f>)).*?(?!\k<f>)(?<second>(?<s>\d)(\k<s>))/';
            $outcomes = preg_match_all($pattern, $stringDice, $matches);
            if ($outcomes) {
                $pts = array_sum($selectedHand);
                echo "This will give you " . $pts . " points!";
            }
            else{
                echo $noMatchMsg;
            }
        }
        else{
            echo "You need to select four dice to submit two pairs.";
        }
        break;
    case "threeKind":
        if (count($selectedHand) == 3){
            $pattern = '/(\d)\1{2}/';
            $outcomes = preg_match_all($pattern, $stringDice, $matches);
            if ($outcomes) {
                $pts = array_sum($selectedHand);
                echo "This will give you " . $pts . " points!";
            }
            else{
                echo $noMatchMsg;
            }
        }
        else{
            echo "You need to select three dice to score three of a kind.";
        }
        break;
    case "fourKind":
        if (count($selectedHand) == 4){
            $pattern = '/(\d)\1{3}/';
            $outcomes = preg_match_all($pattern, $stringDice, $matches);
            if ($outcomes) {
                $pts = array_sum($selectedHand);
                echo "This will give you " . $pts . " points!";
            }
            else{
                echo $noMatchMsg;
            }
        }
        else{
            echo "You need to select four dice to score four of a kind.";
        }
        break;
    case "smallStraight":
        // The combination 1-2-3-4-5. Score: 15 points (sum of all the dice)
        $pattern = '/(12345)/';
        $outcomes = preg_match_all($pattern, $stringDice, $matches);
        if ($outcomes){
            $pts=15;
            echo $matches[0][0] . " gives you a small straight, and " . $pts . " points!";
        }
        else{
            echo $noMatchMsg;
        }
        break;
    case "largeStraight":
        // The combination 2-3-4-5-6. Score: 20 points (sum of all the dice).
        $pattern = "/(23456)/";
        $outcomes = preg_match_all($pattern, $stringDice, $matches);
        if ($outcomes) {
            $pts = 20;
            echo $matches[0][0] . " gives you a large straight, and " . $pts . " points!";
        } else {
            echo $noMatchMsg;
        }
        // echo $outcomes;
        break;
    case "fullHouse":
        if (count($selectedHand) == 5) {
            $pattern = "/(?<first>\d)(\k<first>){2}\d?(?<second>(?!\k<first>)\d)(\k<second>)|(?<third>\d)(\k<third>)\d?(?<fourth>(?!\k<third>)\d)(\k<fourth>){2}/";
            $outcomes = preg_match_all($pattern, $stringDice, $matches);
            if ($outcomes) {
                $pts = array_sum($selectedHand);
                echo "This will give you " . $pts . " points!";
            } else {
                echo $noMatchMsg;
            }
        } else {
            echo "You need to select five dice to submit a full house.";
        }
        break;
    case "chance":
        //Any combination of dice. Score: Sum of all the dice.
        $pts = array_sum($selectedHand);
        echo "This will give you " . $pts . " points";
        break;
    case "yatzy":
        if (count($selectedHand) == 5) {
            $pattern = "/(\d)\1{4}/";
            $outcomes = preg_match_all($pattern, $stringDice, $matches);
            if ($outcomes) {
                $pts = 50;
                echo $matches[0][0] . " gives you a yatzy! And 50 pts! Congrats";
            } else {
                echo $noMatchMsg;
            }
        } else {
            echo "You need to select five dice to submit a yatzy.";
        }
        break;
    default:
        echo "Something went wrong. You selected: " . $scoreChoice;
        // code block
        break;
}



if ($scoreCard->records[$scoreChoice] == null){
    $this->showScoreChoice($scoreChoice, $pts);
    echo "Unlocking the 'Finish Turn' button";
    $endRoundBtn->disabled = false;
}
else{
    //TODO: Something
    echo "This section is already filled";
}



