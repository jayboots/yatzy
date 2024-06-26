<?php
/**
 * Generates a random number between 1 and 6
 * @return int $rollValue
 */
function getRollValue() {
    $rollValue = mt_rand(1, 6);
    return $rollValue;
}

/**
 * Determines the outcomes for a set of five dice,
 * returns these values as a numeric array, and
 * writes these outcomes to the console
 * @return array $newHand - The outcomes for a set of five dice
 */
function getNewHand() {
    $newHand = array(
        getRollValue(),
        getRollValue(),
        getRollValue(),
        getRollValue(),
        getRollValue()
    );
    echo "New hand: " . implode(", ", $newHand) . "\n";
    return $newHand;
}