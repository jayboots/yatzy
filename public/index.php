<?php
require ('_config.php');
require ('app\models\Dice.php');

use Yatzy\Dice;
use Yatzy\YatzyGame;
use Yatzy\YatzyEngine;

$d = new Dice();

for ($i=1; $i<=5; $i++) {
  echo "ROLL {$i}: {$d->roll()}<br>\n" ;
}

