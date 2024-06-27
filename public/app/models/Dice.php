<?php
namespace Yatzy;

echo "This is Dice.php\n";
class Dice {

    public function __construct() {
        echo "Created a die\n";
    }

    function roll() {
    $rollValue = mt_rand(1, 6);
    return $rollValue;
    }

    function getNewHand() {
        $newHand = array(
            $this->roll(),
            $this->roll(),
            $this->roll(),
            $this->roll(),
            $this->roll()
        );
        echo "New hand: " . implode(", ", $newHand) . "\n";
        return $newHand;
    }

}
