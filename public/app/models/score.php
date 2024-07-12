<?php
class Score {
  public $name;
  public $score;

  function __construct($name, $score) {
    $this->name = $name;
    $this->score = $score;
  }
}
?>