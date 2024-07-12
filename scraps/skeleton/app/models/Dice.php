<?php
namespace Yatzy;

// echo "This is Dice.php";
class Dice {

    public $min;
    public $max;

    public function __construct(int $min = 1, int $max = 6)
    {
        $this->min = $min;
        $this->max = $max;
        // echo "Created a die. Min: {$this->min}, Max: {$this->max}\n";
        // echo $this->min;
        // echo $this->max;
    }

    public function roll() {
    $rollValue = mt_rand($this->min, $this->max);
    return $rollValue;
    }

    public function getNewHand() {
        $newHand = array(
            $this->roll(),
            $this->roll(),
            $this->roll(),
            $this->roll(),
            $this->roll()
        );
        //echo "New hand: " . implode(", ", $newHand) . "\n";
        return $newHand;
    }
}

// Roll a die
$d = new Dice(1, 6);

// Get a new hand of dice
$hand = $d->getNewHand();

header('Content-Type: application/json');
echo json_encode($hand);

// Get request to the above
if(isset($_GET['action'])) {
    // Roll a die
    $d = new Dice(1, 6);

    // Get a new hand of dice
    $hand = $d->getNewHand();

    header('Content-Type: application/json');
    echo json_encode($hand);
}