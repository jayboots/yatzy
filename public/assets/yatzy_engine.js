import { YatzyGame } from "./yatzy_game.js";

var game = null;
var canRoll = false;
var gameOver = true; //TODO: implement, also maybe change to state\

const dicePrefix = "d_";
const lockPrefix = "l_";

window.onload=function(){
    console.log("Window loaded")
    const rollBtn = document.getElementById("rollBtn");
    const endRoundBtn = document.getElementById("endRoundBtn");
    const resetBtn = document.getElementById("resetBtn");
    const stateBtn = document.getElementById("stateBtn");

    //TODO: Implement disabled on start until new game created
    endRoundBtn.disabled = true;
    rollBtn.disabled = true;

    //Event Listeners
    rollBtn.addEventListener("click", rollDice, true);
    endRoundBtn.addEventListener("click", endRound, true);
    resetBtn.addEventListener("click", resetGame, true);
    stateBtn.addEventListener("click", getGameState, true);

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

}


/**
 * Writes some information about the state of the game to the console.
 */
function getGameState(){
    if (game == null){
        console.log("No active game object. Try creating a new game.")
    }
    else{
        console.log("Current round: " + game.currentRound + " / " + game.maxRounds)
        console.log("Rolls available: " + game.rollsLeft + " / " + game.maxRolls)
        console.log("Current score: " + game.score) //TODO: Implement
    }
    console.log("Can roll dice: " + canRoll)
    console.log("Game Currently Over: " + gameOver)
}


/**
 * Make a new game and reset some state variables and UI things.
 */
function resetGame(){
    console.log("Creating new game.")
    game = new YatzyGame();
    // game = new YatzyGame(3, 3) //For testing
    console.log(game)
    canRoll = true;
    gameOver = false;
    rollBtn.disabled = !canRoll;
    drawDice(game.activeHand)
    drawLocks(game.lockRoster)
    getGameState()
}


/**
 * Rolls the dice according to the logic of the game.
 */
function rollDice(){
    console.log("Attempting to roll the dice...")
    if (canRoll){
        game.rollDice();
        var activeHand = game.activeHand;
        console.log(activeHand)
        drawDice(activeHand)
        if (game.rollsLeft == 0){
            canRoll = false;
            rollBtn.disabled = !canRoll;
        }
        console.log("Unlocking the 'Finish Turn' button")
        endRoundBtn.disabled = false;
    }
    else{
        console.log("Cannot currently roll the dice.") //either game hasn't been created yet, or game logic doesn't allow this.
        //Disable the roll button in the DOM here
    }
}


/**
 * Ends a round and determines whether the round ending means the game has finished or not.
 */
function endRound(){
    //Turn off this button after it is pressed, because:
    // - either a minimum of 1 roll is required before ending the next turn, or
    // - the game is over (i.e. this was the last round)
    endRoundBtn.disabled = true;

    if (game != null){
        game.incrementRound()
        if (game.currentRound == (game.maxRounds)){
            gameOver = true;
            //TODO: Endgame logic, view score, try again, new game, etc.
            rollBtn.disabled = true; //Can't roll dice if the game is over.
            console.log("GAME IS OVER. Can make a new game, if you want.")
        }
        else{
            game.resetDice() //new round = new dice, new rolls, no locks
            canRoll = true;
            drawDice(game.activeHand) //draw the reset
            drawLocks(game.lockRoster) //draw the locks here, when implemented
            rollBtn.disabled = false; //We're startin g a new round so we need to be able to roll
        }
    }
}


/**
 * Updates the values of the dice visuals based on the values stored in the YatzyGame object
 *
 * @param {*} activeHand - the values of the dice to draw
 */
function drawDice(activeHand){
    if (game != null){
        if (activeHand.includes(null)){
            for (let i = 0; i < activeHand.length; i++) {
                document.getElementById(dicePrefix+i).innerText = "?";
            }
        }
        else{
            let lockedDice = game.lockRoster;
            console.log("Updated the drawn dice")
        
            for (let i = 0; i < lockedDice.length; i++) {
                // If the die is locked, don't change the value
                if (lockedDice[i] == 0) {
                    // console.log("Die # " + (i + 1) + " is free. Rerolling value." );
                    document.getElementById(dicePrefix+i).innerText = activeHand[i];
                } else {
                    console.log("Die # " + (i + 1) + " is locked." )
                }
            }
        }
    }
    else{ //Not sure how we'd get to this state, but just in case, have a message for it
        console.log("Cannot draw dice, no game object lockRoster to reference against")
    }
}


/**
 * Handles the interaction between the UI lock interface(s) and the YatzyGame lockRoster
 */
function toggleLock(){
    let ID = this.id.split("_")[1];
    console.log("Clicked lock " + ID)
    // Check lock status then invert it, provided there is a game and no null values in the turn
    if ((game != null) && (!game.activeHand.includes(null))){
        if (game.lockRoster[ID] == 0){
            // If unlocked, lock
            game.lockRoster[ID] = 1;
            console.log("Locking die " + (1 + parseInt(ID)))
       }
       else {
           // If locked, unlock
            game.lockRoster[ID] = 0;
            console.log("Unlocking die " + (1 +  parseInt(ID)))
       }
       drawLocks(game.lockRoster)
       console.log("Lock roster: " + game.lockRoster)
    }
    else{
        //TODO: Disable the locks in the GUI when they can't be used.
        console.log("...but the locks can't be used right now.")
    }

}


/**
 * Given a roster of numbers, draws the corresponding lock states to the GUI
 *
 * @param {number[]} lockRoster
 */
function drawLocks(lockRoster){
    for (let i = 0; i < lockRoster.length; i++) {
        if (lockRoster[i] == 0){
            document.getElementById(lockPrefix+i).innerText = "🔓"
        }
        else {
            document.getElementById(lockPrefix+i).innerText = "🔒";
        }
    }
}

// TODO: Adapt to our current OOP setup. Thanks Tori.

// //index 0-5 => upper section, index 6-14 => lower section
// var combinations = new Array("ones", "twos", "threes", "fours", "fives", "sixes", 
//                                 "one pair", "two pairs", "three of a kind", "four of a kind", "small straight", "large straight", "full house", "chance", "yatzy");

// //possible scores for the round, after player rolls
// var roundScoreboard = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);

// //final score board after player has confirmed a score to keep; -1 => no value set
// var finalScoreboard = new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);

// var bonus = 0;
// var totalScore = 0;

// /**
//  * To calculate player's score choices after they roll.
//  * Re-call this function after each roll 
//  * @returns an array of all possible scores with the given combination of dice
//  */
// function getPotentialScores(dice) {
//     //refresh scoreboard 
//     roundScoreboard = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);

//     //sort dice for easier checking
//     dice.sort();
//     console.log("sorted dice: " + dice);

//     var count = new Array(0,0,0,0,0,0);
//     var smallStraight = true;
//     var largeStraight = true;
//     var pairs = new Array();

//     for (var i=0; i<dice.length; i++) {
//         const curIndex = dice[i]-1;
//         //upper section => update sum of singles
//         roundScoreboard[curIndex] += dice[i];

//         //lower section  => count duplicates
//         count[curIndex]++;

//         //check for straights
//         if (smallStraight) {
//             smallStraight = dice[i] == i+1 ? true:false;
//         }
//         if (largeStraight) {
//             largeStraight = dice[i] == i+2 ? true:false;
//         }
        
//         //calculate chance score 
//         roundScoreboard[13] += dice[i];
//     }

//     //update straight scores
//     if (smallStraight) {roundScoreboard[10] = 15}
//     if (largeStraight) {roundScoreboard[11] = 20}

//     //update other scores
//     for (var i=0; i<count.length; i++) {
//         const diceValue = i+1;

//         //check for pairs
//         if (count[i] >= 2) {
//             roundScoreboard[6] = (diceValue)*2;
//             pairs.push(diceValue);
//         }
//         //two pairs
//         if (pairs.length == 2) {
//             roundScoreboard[7] = pairs[0]*2 + pairs[1]*2;
//         }

//         //check for three of a kind
//         if (count[i] == 3) {
//             if (pairs.length > 1) { //there is a full house
//                 roundScoreboard[12] = (pairs[0] != diceValue ? pairs[0]:pairs[1])*2 + diceValue*3;
//             }
//             roundScoreboard[8] = diceValue*3;
//         }

//         //check for four of a kind
//         else if (count[i] == 4) {
//             roundScoreboard[9] = diceValue*4;
//         }

//         //check for five of a kind (yatzy)
//         else if (count[i] == 5) {
//             roundScoreboard[14] = diceValue*5;
//         }
//     }
//     return roundScoreboard;
// }

// /**
//  * Given player's choice by array index (starting at 0), update their total score.
//  * Should only be called after getPotentialScores(dice) is called to ensure the final score will be correct
//  * @returns updated scoreboard along with the total score in an array: {scoreboard array, total score}
//  */
// function updateScore(choice) {
//     //player's score choice is valid => update final scoreboard and add value to total score
//     if (finalScoreboard[choice] == -1) {
//         finalScoreboard[choice] = roundScoreboard[choice];

//         //check for bonus
//         var tempScore = 0;
//         for (var i=0; i<6; i++) {
//             tempScore += finalScoreboard[i] != -1 ? finalScoreboard[i]:0;
//         }
//         if (bonus==0 && tempScore >= 63) {
//             bonus = 50;
//         }

//         //update total score
//         totalScore += (roundScoreboard[choice] + bonus);

//     } else {
//         console.log("Already chosen a score for this box");
//     }

//     return [finalScoreboard, totalScore];
// }

// /**
//  * resets all scores: potential/round, final, and total
//  * used only when game ends
//  */
// function resetScore() {
//     roundScoreboard = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
//     finalScoreboard = new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
//     bonus = 0;
//     totalScore = 0;
// }



// //for testing-------------------------------------------------------------------------------------------------
// function showRoundScore() {
//     for (var i=0; i<combinations.length; i++) {
//         console.log(combinations[i] + ": " + roundScoreboard[i]);
//     }
// } 

// function showFinalScore() {
//     for (var i=0; i<combinations.length; i++) {
//         console.log(combinations[i] + ": " + finalScoreboard[i]);
//     }
//     console.log("total score: " + totalScore)
// }

// // //test run
// // getPotentialScores([1,2,3,4,5]);
// // showRoundScore();
// // updateScore(10);
// // console.log("");

// // getPotentialScores([1,5,5,5,5]);
// // showRoundScore();
// // updateScore(9);
// // console.log("");

// // showFinalScore();
// // resetScore();