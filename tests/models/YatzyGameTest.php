<?php
namespace Yatzy\Test;

use Yatzy\YatzyGame;
use PHPUnit\Framework\TestCase;

class YatzyGameTest extends TestCase
{

    public function testConstructor()
    {
        $yg = new YatzyGame();
        $this->assertEquals(3, $yg->maxRolls);
        $this->assertEquals(15, $yg->maxRounds);
        
    }
}