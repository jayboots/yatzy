# Design System

This document outlines the design system for the project.

## Fonts

- **Primary Font:** Poppins (Light Italic, Regular, Medium, Semibold, and Extrabold) sans-serif

## Colours

- **Primary Colour:** #eb3349 (Munsell Red)
- **Primary Accent:** #e89f9b (Melon Pink)
- **Secondary Colour:** #5db6d7 (Aero Blue)
- **Secondary Accent:** #4a7e92 (Air Force Blue)
- **Tertiary Colour:** #ffffff (White)
- **Tertiary Accent:** #ffe4e1 (Misty Rose)

## Designing the Dice

Using the techniques learned in Lab 4, document the look and feel of your dice.  Hint: Create a `/docs/assets/design_system/dice.html` to help you _document through code_ the design.

## Game Components

This section provides documentation of major game components.

### Starting a new game

To start a new game, users click a button to initialize a new game. This reveals the play area and initializes the game objects (i.e. an instance of *YatzyGame*) and their associated variables.

### In-Game Play (Rules and Controls)

This implementation of Yatzy is a single-player 5-die game with 15 turns and 15 score slots to complete on a score card. Each turn begins with rolling a set of dice, and ends when a score is submitted. When all turns have elapsed (and the scorecard is complete), the game has ended.

Each score slot on the score card has different dice requirements for points. By making choices about how to complete the score card as turns progress, the player's goal is to get the highest score possible.

#### Turn Begin (Roll Phase)

- To roll the dice, players click a button. Clicking the button provides the player with five random dice values on the screen.
- The player can click the button again to re-roll all five dice up to two times before the button is disabled.
- The player have the option of locking and unlocking individual dice by clicking on the lock icon next to a die. Locking a die prevents its value from changing when dice are re-rolled.

#### Scoring Strategy (Decision Phase)

- The player can select which dice they would like to count towards a score choice by clicking on them with the cursor.
- Players must select at least one die to progress a turn.
- Dice that have been selected will visually change to show they have been chosen for scoring consideration.
- Dice can be deselected by clicking on them again.

#### Score Calculation / Turn End

- After selecting at least one die, the player clicks on the score category in the score card that they would like to earn points in.
- Players can only select each category once, and so should consider carefully which dice to submit for each category to maximise their score.
- After making a selection, players click a button to submit their score. This ends the turn.
  - If this is not the final turn, a new turn begins and the player returns to the roll phase.
  - If this is the final turn, the game ends.

### Scoreboard

The interactive scoreboard shows information about the game. It keeps track of the number of points awarded per category, as well as the total number of points earned throughout the game. Each row can be completed only once per game.

Players can click any category row to view the potential points for a choice. The most recently-selected category will be used for scoring when a turn ends.

| **Category** | **Pts** | **Description**                                         |
|--------------|---------|---------------------------------------------------------|
| Ones         |         | _The sum of all dice showing the number 1._             |
| Twos         |         | _The sum of all dice showing the number 1._             |
| ...          |         |                                                         |
| Chance       |         | _Any combination of dice. Score: Sum of all the dice._  |
| Yatzy        |         | _All five dice with the same number. Score: 50 points._ |
| **Total**    |    0    |                                                         |

The name of each score category appears under the **Category** column.

The number of points earned per category is displayed in the **Pts** column.

The criteria for computing score is provided in the **Description**. This information provides the player with context to help them make strategic scoring choices.

### End of the game

- The game ends when the score card has been completed and all 15 turns. The base score is computed as the sum of all category scores (a.k.a. the Pts rows).
- If a player has scored 63 or more points in the first six categories, a bonus score of 50 points is added to the total.
- The player is shown their final total score (base score and bonus score) at the bottom of the score card.
- A button appears that allows the player to start a new game.
  - Players can begin a new game by clicking this button. This will erase all game and score information.
  - To quit the game, players close the browser.

### Additional concepts like header, footer

There is no header in this implementation of yatzy.

A footer displays the year the game was completed at the bottom of the page.