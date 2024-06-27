<?php
require_once '_config.php';
require_once 'app\models\Dice.php';
require_once 'app\models\YatzyGame.php';
require 'app\models\YatzyEngine.php';

use Yatzy\Dice;
use Yatzy\YatzyGame;
use Yatzy\YatzyEngine;

// Testing the DICE class

// Roll a die
$d = new Dice();
for ($i=1; $i<=5; $i++) {
  echo "ROLL {$i}: {$d->roll()}<br>\n" ;
}

// Get a new hand of dice
$hand = $d->getNewHand();
$hand;

$yg = new YatzyGame();