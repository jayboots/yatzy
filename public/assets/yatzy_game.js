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

const dicePrefix = "d_";
const lockPrefix = "l_";

window.onload=function(){
    const rollBtn = document.getElementById("rollBtn");
    const endTurnBtn = document.getElementById("endTurnBtn");
    const resetBtn = document.getElementById("resetBtn");
    const twoPlayerBtn = document.getElementById("twoPlayerBtn");

    rollBtn.addEventListener("click", rollDice, true);
    endTurnBtn.addEventListener("click", endTurn, true);
    resetBtn.addEventListener("click", resetGame, true);
    twoPlayerBtn.addEventListener("change", resetGame, true);

    // #TODO: For locks and dice, we can optimize later by switching to the DOM

    // Loading the locks...
    const l0 = document.getElementById("l_0");
    const l1 = document.getElementById("l_1");
    const l2 = document.getElementById("l_2");
    const l3 = document.getElementById("l_3");
    const l4 = document.getElementById("l_4");

    l0.addEventListener("click", toggleLock, true);
    l1.addEventListener("click", toggleLock, true);
    l2.addEventListener("click", toggleLock, true);
    l3.addEventListener("click", toggleLock, true);
    l4.addEventListener("click", toggleLock, true);

    // Loading the dice
    // TODO: change to be auto-generated in future by the DOM
    const d0 = document.getElementById("d_0");
    const d1 = document.getElementById("d_1");
    const d2 = document.getElementById("d_2");
    const d3 = document.getElementById("d_3");
    const d4 = document.getElementById("d_4");

    resetGame()
}


/**
 * Manages the lock states of the dice locks. Disallows locking dice on any first turn.
 */
function toggleLock(){
    //No locking dice on any first turn, to prevent locking in unrolled values
    if (rollsLeft < maxRolls) {
        let ID = this.id.split("_")[1];
        // console.log("Clicked lock " + ID)
        // Check lock status then invert it
        if (lockedDice[ID] == 0){
             // If unlocked, lock
            lockedDice[ID] = 1;
            console.log("Locking die " + (1 + parseInt(ID)))
            document.getElementById(lockPrefix+ID).innerText = "🔒";
        }
        else {
            // If locked, unlock
            lockedDice[ID] = 0;
            console.log("Unlocking die " + (1 +  parseInt(ID)))
            document.getElementById(lockPrefix+ID).innerText = "🔓"
        }
        console.log("Lock roster: " + lockedDice)
        // Change the innter text accordingly
    }
}

/**
 * Resets all relevant game variables
 * to start a new game with a clean slate
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
    // Reset the locks
    resetLocks()
    getGameStatusUpdate()
}


/**
 * Resets all lock states to unlocked
 * And updates visuals (for now)
 */
function resetLocks(){
    console.log("Resetting all locked dice.")
    lockedDice = new Array(0,0,0,0,0);

    //TODO: Move this to a separate function for updating visuals
    for (let i =0; i < lockedDice.length; i++) {
        // console.log(lockPrefix+i)
        document.getElementById(lockPrefix+i).innerText = "🔓"
     }
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
 * Switches the player, resets the amount of rolls left,
 * and resets locks on dice.
 */
function switchPlayer(){
    isPlayerOne = !isPlayerOne;
    console.log(">>> The player has been switched.")
    //When a player switches, we reset unlock all dice
    resetLocks()
    getGameStatusUpdate()
}

/**
 * Ends the current turn and manages variable states related
 * to ending turns, like switching players, counting down rounds and rolls, and triggering the end game state.
 */
function endTurn(){
    if (rollsLeft == maxRolls){
        // It should not be possible to reach this state, but if it happens, we don't let the player end their turn without rolling at least once, to prevent "null" dice values.
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
                //When the round ends, we unlock all dice
                resetLocks()
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


/**
 * Updates the active hand with new values,
 * taking into account whether any dice are locked or not.
 * Decreases the roll count if applicable
 *
 * @returns {Number[]} - activeHand
 */
function rollDice(){
    if (rollsLeft > 0){
        console.log(">>> " + getPlayerName(isPlayerOne) + " rolls the dice.");

        // activeHand = getNewHand()
        let newSet = getNewHand()

        for (let i = 0; i < lockedDice.length; i++) {
            // If the die is locked, don't change the value
            if (lockedDice[i] == 0) {
                // console.log("Die # " + (i + 1) + " is free. Rerolling value." );
                activeHand[i] = newSet[i];

                //TODO: Move anything updating visuals to own section.
                document.getElementById(dicePrefix+i).innerText = activeHand[i];
            } else {
                console.log("Die # " + (i + 1) + " is locked." )
            }
        }
        
        rollsLeft -= 1;
    }
    else{
        // This state should not be reachable based on the interface
        console.log(">>> " + getPlayerName(isPlayerOne) + " has no more rolls and needs to end their turn.");
    }
    getGameStatusUpdate()
    return activeHand
}