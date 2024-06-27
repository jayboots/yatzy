<?php
namespace Yatzy;

echo "This is Dice.php\n";
class Dice {

    public function __construct() {
        echo "Created a die";
    }

    function roll() {
    $rollValue = mt_rand(1, 6);
    return $rollValue;
    }

}
