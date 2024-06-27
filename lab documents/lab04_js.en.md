# Lab 4: Yatzy Game JS

Using JavaScript, the students (in group) will implement key components of
the Yatzy game.

## Learning Objectives

* Experience writing JavaScript

## Resources

* [Yatzy](https://en.wikipedia.org/wiki/Yatzy)
* [JavaScript](https://en.wikipedia.org/wiki/ECMAScript)
* JavaScript Web Applications. MacCaw, A. (2011) United-States: O'Reilly Media.
* Simplifying JavaScript: Writing Modern JavaScript with ES5, ES6, and Beyond. Joe Morgan, [https://pragprog.com/titles/es6tips/simplifying-javascript/](https://pragprog.com/titles/es6tips/simplifying-javascript/)
* Rediscovering JavaScript - Master ES6, ES7, and ES8. Venkat Subramaniam [https://pragprog.com/titles/ves6/rediscovering-javascript/](https://pragprog.com/titles/ves6/rediscovering-javascript/)

## Tasks

This is a group lab in your `yatzy`
repository from previous labs.

### 1. Set Up Your Project

Create a the following files in `/public/assets`

* dice.js
* yatzy_game.js
* yatzy_engine.js

Create a `/public/test.html` file to
execute / test your JavaScript code.  Load the three files above
in your HTML `head`.

Commit these changes and push to [GitHub](https://github.com/).

### 2. Implement Rolling a Dice

In `dice.js`, implement a dice roller.

Commit these changes and push to [GitHub](https://github.com/).

### 3. Implement Game State

In `yatzy_game.js`, implement a current state of a game.

A yatzy game comprises of a turn, which includes

* Which roll you are on (0, 1, 2, or 3)
* Current value on each of the 5 dice
* Keep / re-roll state of each dice

The `YatzyGame` should focus on tracking the state of the game
without knowing much about the rules, that comes next!

Commit these changes and push to [GitHub](https://github.com/).

### 4. Implement Yatzy Engine

Completion of the engine is not required to satisfy the lab.

In `yatzy_engine.js` implement a set of helper function
to capture the scoring of the game.  This includes:

* The score of a specific turn.  The input should be a `game` and a `score box`
  and the output should be a score for that box (e.g. the sum of ones for the `ones` box.

* Updating the overall score of the game.  This should include
  the calculation of the bonus.  The input should be a `game`
  and the output should that the provided game's overall `score`
  and `bonus` are properly calculated.

Commit these changes and push to [GitHub](https://github.com/).
