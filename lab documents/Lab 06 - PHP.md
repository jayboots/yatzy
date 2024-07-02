# Lab 6: Yatzy Game PHP

Using PHP, the students will (re)implement key components of
the Yatzy game.

## Learning Objectives

* Experience writing PHP
* Experience writing automated tests using PHPUnit

## Resources

* [Yatzy](https://en.wikipedia.org/wiki/Yatzy)
* [Sublime Text IDE](https://www.sublimetext.com)
* [Visual Studio](https://code.visualstudio.com)
* [PHP](https://www.php.net) (`php --version`)
* [PHPUnit](https://phpunit.de) (`phpunit --version`)

## Tasks

This is an individual lab in your `yatzy`
repository from previous labs.


### 1. Set Up Your Project

For this lab, any modern version of PHP will work (PHP 7+).

Create the following files in `/app/models`

* Dice.php
* YatzyGame.php
* YatzyEngine.php

Create a empty `/public/index.php` file to execute / test your PHP code.

To run the application, you will need a bootstrap autoloader.
Create a `/public/_config.php` file to implement a
file loader (`spl_autoload_register`).

```php
<?php

$GLOBALS["appDir"] = resolve_path("app");

function resolve_path($name)
{
    if ($name == ".")
    {
        $publicRoot = $_SERVER["DOCUMENT_ROOT"] . "/..";
        $appRoot = $_SERVER["DOCUMENT_ROOT"];
    }
    else if ($_SERVER["DOCUMENT_ROOT"] != "")
    {
        $publicRoot = $_SERVER["DOCUMENT_ROOT"] . "/../$name";
        $appRoot = $_SERVER["DOCUMENT_ROOT"] . "/$name";
    }
    else
    {
        return "../{$name}";
    }

    return file_exists($publicRoot) ? realpath($publicRoot) : realpath($appRoot);
}

spl_autoload_register(function ($fullName) {
    $parts = explode("\\", $fullName);
    $len = count($parts);
    $className = $parts[$len - 1];
    if (file_exists($GLOBALS["appDir"] . "/models/{$className}.php"))
    {
      require_once $GLOBALS["appDir"] . "/models/{$className}.php";
    }
});
```

Commit these changes and push to [GitHub](https://github.com/).

### 2. Implement Rolling a Dice

In `Dice.php`, implement a dice roller. Your `roll` method will need a
random number generator, take a look at
[rand(int $min, int $max): int](https://www.php.net/manual/en/function.rand.php).

You can run the application by running

```bash
(cd public && php -S localhost:4000)
```

And, here is an example test in `public/index.php` to use the `Dice.php`.

```php
<?php
require_once('_config.php');

use Yatzy\Dice;

$d = new Dice();

for ($i=1; $i<=5; $i++) {
  echo "ROLL {$i}: {$d->roll()}<br>";
}
```

You can then visit `http://localhost:4000` to see the your _tests_ in the browser,
for example.

```
ROLL 1: 5
ROLL 2: 2
ROLL 3: 6
ROLL 4: 3
ROLL 5: 3
```

Continue to implement the `Dice.php` using `index.php` for testing your implementation.

Commit these changes and push to [GitHub](https://github.com/).

### 3. Implement Game State

In `YatzyGame.php`, implement a current state of a game.

A yatzy game comprises of a turn, which includes

* Which roll you are on (0, 1, 2, or 3)
* Current value on each of the 5 dice
* Keep / re-roll state of each dice

The `YatzyGame` should focus on tracking the state of the game
without knowing much about the rules, that comes next!

Use `index.php` for testing your implementation.

Commit these changes and push to [GitHub](https://github.com/).

### 4. Implement Yatzy Engine

Completion of the engine is not required to satisfy the lab.

In `YatzyEngine.php` implement a set of helper function
to capture the scoring of the game.  This includes:

* The score of a specific turn.  The input should be a `game` and a `score box`
  and the output should be a score for that box (e.g. the sum of ones for the `ones` box.

* Updating the overall score of the game.  This should include
  the calculation of the bonus.  The input should be a `game`
  and the output should that the provided game's overall `score`
  and `bonus` are properly calculated.

Use `index.php` for testing your implementation.

Commit these changes and push to [GitHub](https://github.com/).

### 5. Add PHPUnit Testing

Create an example test file `/tests/YatzyTest.php` with the following

```php
<?php
namespace Yatzy\Test;

use PHPUnit\Framework\TestCase;

class YatzyTest extends TestCase
{

    public function testNothing()
    {
        $this->assertEquals(1, 1);
    }
}
```

Using [PHPUnit](https://phpunit.de) you can run those tests with

```bash
phpunit tests
```

Commit these changes and push to [GitHub](https://github.com/).

### 5. Add automated tests

Create the following test files in `/tests/models`

* DiceTest.php
* YatzyGameTest.php
* YatzyEngineTest.php

Here is an example of one test for Dice.php.

```php
<?php
namespace Yatzy\Test;

use Yatzy\Dice;
use PHPUnit\Framework\TestCase;

class DiceTest extends TestCase
{

    public function testConstructor()
    {
        $d = new Dice();
        $this->assertEquals(1, $d->min);
        $this->assertEquals(6, $d->max);

        $d = new Dice(10, 20);
        $this->assertEquals(10, $d->min);
        $this->assertEquals(20, $d->max);
    }
}
```

To run these tests, you will need a bootstrap autoloader to
load those models.  Create a `/tests/bootstrap.php` with the following

```php
<?php

spl_autoload_register(function ($fullName) {
    $parts = explode("\\", $fullName);
    $len = count($parts);
    $className = $parts[$len - 1];
    if (file_exists("app/models/{$className}.php"))
    {
      require_once "app/models/{$className}.php";
    }
});
```

Using [PHPUnit](https://phpunit.de) you can run those tests with

```bash
phpunit --bootstrap=tests/bootstrap.php tests
```
