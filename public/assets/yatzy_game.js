import {
    getNewHand
} from "./dice.js";

const maxRolls = 3
var rollsLeft = maxRolls;

// const maxRounds = 10;
const maxRounds = 3; //for testing
const roundStart = 1;
var currentRound = roundStart;

var numPlayers = null; //Set to 1 or 2 programmatically, somehow
var isPlayerOne = new Boolean(true);
var activeHand = new Array(null, null, null, null, null);
var lockedDice = new Array(0,0,0,0,0);

window.onload=function(){
    const rollBtn = document.getElementById("rollBtn");
    const endTurnBtn = document.getElementById("endTurnBtn");
    const resetBtn = document.getElementById("resetBtn");
    const twoPlayerBtn = document.getElementById("twoPlayerBtn");

    rollBtn.addEventListener("click", rollDice, true);
    endTurnBtn.addEventListener("click", endTurn, true);
    resetBtn.addEventListener("click", resetGame, true);
    twoPlayerBtn.addEventListener("change", resetGame, true);

    resetGame()
}

/**
 * Resets the game variables
 */
function resetGame(){
    console.log("Starting a new game.")
    if (twoPlayerBtn.checked){
        numPlayers = 2;
    }
    else{
        numPlayers = 1;
    }
    rollsLeft = maxRolls;
    currentRound = roundStart;
    isPlayerOne = Boolean(true);
    activeHand = new Array(null, null, null, null, null);
    lockedDice = new Array(0,0,0,0,0);
    getGameStatusUpdate()
}

/**
 * Prints some information about the current state of the game to the console
 */
function getGameStatusUpdate(){
    if (numPlayers == 1){
        if ((currentRound == roundStart) && (rollsLeft == maxRolls)){
            console.log("This is a single player game.")
        }
        console.log("It is round " + currentRound)
        console.log("You have " + rollsLeft + " rerolls(s) left.")
    }
    else{
        if ((currentRound == roundStart) && (rollsLeft == maxRolls)){
            console.log("This is a two-player game.")
        }
        console.log("It is currently " + getPlayerName(isPlayerOne) + "'s turn.")
        console.log("It is round " + currentRound)
        console.log(getPlayerName(isPlayerOne) + " has " + rollsLeft + " rerolls(s) left.")
    }

    if (rollsLeft == maxRolls){
        endTurnBtn.disabled = true;
    }
    else{
        endTurnBtn.disabled = false;
    }

    if (rollsLeft < 1){
        rollBtn.disabled = true;
    }
    else{
        rollBtn.disabled = false;
    }

}

/**
 * Returns the name of the player.
 *
 * @param {Boolean} isPlayerOne - True if player is Player 1, False otherwise
 * @returns {("Player 1" | "Player 2")}
 */
function getPlayerName(isPlayerOne){
    if (isPlayerOne){
        return "Player 1"
    }
    else{
        return "Player 2"
    }
}

/**
 * Switches the player and resets the amount of rolls left
 */
function switchPlayer(){
    isPlayerOne = !isPlayerOne;
    console.log(">>> The player has been switched.")
    getGameStatusUpdate()
}

/**
 * Ends the current turn
 */
function endTurn(){
    if (rollsLeft == maxRolls){
        // It should not be possible to reach this state, but if it happens, we don't let the player end their turn without rolling.
        console.log(getPlayerName(isPlayerOne) + ", you need to roll the dice at least once before you can end your turn.")
    }
    else{
        // If final round of single player game, end game
        if (numPlayers == 1){
            if (currentRound == maxRounds){
                console.log("Game Over. Your final score is X")
            }
            else{
                console.log(">>> " + getPlayerName(isPlayerOne) + " is ending their turn with " + rollsLeft + " reroll(s) left");
                rollsLeft = maxRolls
                currentRound += 1;
                getGameStatusUpdate()
            }
        }
        else { //If this is a two-player game
            // And we are on the second player's turn
            if (!isPlayerOne){
                // And we are out of rounds
                if (currentRound == maxRounds){
                    //Then the game is over and a winner is declared.
                    console.log("Game Over. Player X won the game with a final score of Y")
                }
                // But there are still more rounds to play
                else{
                    //Player 2 ends their turn and the round increases to the next round, and player 1 plays the next rond.
                    console.log(">>> " + getPlayerName(isPlayerOne) + " is ending their turn with " + rollsLeft + " reroll(s) left");
                    rollsLeft = maxRolls
                    currentRound += 1;
                    switchPlayer();
                }
            }
            //And we are on the first player's turn
            else {
                //Then the player ends their turn and we switch to player 2
                //We don't increase the round.
                console.log(">>> " + getPlayerName(isPlayerOne) + " is ending their turn with " + rollsLeft + " reroll(s) left");
                rollsLeft = maxRolls;
                switchPlayer();
            }
        }
    }
}

function rollDice(){
    if (rollsLeft > 0){
        console.log(">>> " + getPlayerName(isPlayerOne) + " rolls the dice.");

        // activeHand = getNewHand();
        
        rollsLeft -= 1;
    }
    else{
        console.log(">>> " + getPlayerName(isPlayerOne) + " has no more rolls and NEEDS TO END THEIR TURN.");
    }
    getGameStatusUpdate()
}



