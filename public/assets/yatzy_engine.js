import { YatzyGame } from "./yatzy_game.js";

var game = null;
var canRoll = false;
var gameOver = true; //TODO: implement, also maybe change to state\

const dicePrefix = "d_";
const lockPrefix = "l_";

const dieInactive = "white"
const dieActive = "lightblue"

// Handles which dice are "selected" for score calculation
var selectRoster = [false, false, false, false, false]

// Pseudo-class object Rule: score, used-up status
var scoreCard = { 
    "ones":[null,false], 
    "twos":[null,false], 
    "threes":[null,false],
    "fours":[null,false], 
    "fives":[null,false], 
    "sixes":[null,false], 
    "onePair":[null,false], 
    "twoPairs":[null,false], 
    "threeKind":[null,false], 
    "fourKind":[null,false], 
    "smallStraight":[null,false], 
    "largeStraight":[null,false], 
    "fullHouse":[null,false], 
    "chance":[null,false], 
    "yatzy":[null,false], 
};

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

    d0.addEventListener("click", toggleDie, true);
    d1.addEventListener("click", toggleDie, true);
    d2.addEventListener("click", toggleDie, true);
    d3.addEventListener("click", toggleDie, true);
    d4.addEventListener("click", toggleDie, true);
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
    deselectDice()
    getGameState()
}


/**
 * Rolls the dice according to the logic of the game.
 */
function rollDice(){
    console.log("Attempting to roll the dice...")
    if (canRoll){
        game.rollDice();
        deselectDice(); //reset all selected dice when rolling
        var activeHand = game.activeHand;
        console.log(activeHand)
        drawDice(activeHand)

        //Do something with the scorecard here
        // parseScores(activeHand)

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

// Two dice showing the same number. Score: Sum of those two dice
function onePair(_dice){
    let pattern = /(\d)\1/g
    let outcomes = _dice.match(pattern)
    console.log(outcomes)
}

// Two different pairs of dice. Score: Sum of dice in those two pairs
function twoPairs(_dice){
    let pattern = /(?<first>(?<f>\d)(\k<f>)).*?(?!\k<f>)(?<second>(?<s>\d)(\k<s>))/g
    let outcomes = _dice.match(pattern)
    console.log(outcomes)
}

// Three dice showing the same number. Score: Sum of those three dice
function threeKind(_dice){
    let pattern = /(\d)\1{2}/g
    let outcomes = _dice.match(pattern)
    console.log(outcomes)
}

// Four dice with the same number. Score: Sum of those four dice
function fourKind(_dice){
    let pattern = /(\d)\1{3}/g
    let outcomes = _dice.match(pattern)
    console.log(outcomes)
}

// The combination 1-2-3-4-5. Score: 15 points (sum of all the dice)
function smallStraight(_dice){
    let pattern = /(12345)/g
    let outcomes = _dice.match(pattern)
    console.log(outcomes)
}

// The combination 2-3-4-5-6. Score: 20 points (sum of all the dice).
function largeStraight(_dice){
    let pattern = /(23456)/g
    let outcomes = _dice.match(pattern)
    console.log(outcomes)
}

// Any set of three combined with a different pair. Score: Sum of all the dice.
function fullHouse(_dice){
    let pattern = /(?<first>\d)(\g{first}){1}\d?(?<second>\d)(\g{second}){2}|(?<third>\d)(\g{third}){2}\d?(?<fourth>\d)(\g{fourth}){1}/g //Debugging... false pattern for now
    let outcomes = _dice.match(pattern)
    console.log(outcomes)
}

// Any combination of dice. Score: Sum of all the dice.
function chance(_dice){
    console.log(_dice)
}

// All five dice with the same number. Score: 50 points
function yatzy(_dice){
    let pattern = /(\d)\1{4}/g
    let outcomes = _dice.match(pattern)
    console.log(outcomes)
}

// Toggle which dice are selected
function toggleDie(){
    if (game != null && !game.activeHand.includes(null)){
        let ID = this.id.split("_")[1];
        let die = document.getElementById(this.id);
        console.log("Clicked die " + ID);
        selectRoster[ID] = ! selectRoster[ID];
        if (selectRoster[ID]){
            die.style.backgroundColor = dieActive;
        }
        else{
            die.style.backgroundColor = dieInactive;
        }
    
        let selectedHand = [];
        for (let i = 0; i < 5; i++) {
            if (selectRoster[i]){
                selectedHand.push(game.activeHand[i]) ;
            }
        }
        console.log("Selected hand: " + selectedHand);
        console.log("Active dice: " + selectRoster);
    }
}

/**
 * Deselects all dice and returns the colour to the default.
 */
function deselectDice(){
    console.log("Deselecting dice")
    let dice = document.getElementsByClassName("die");
    for (let i = 0; i < dice.length; i++) {
        let ID = dice[i].id
        document.getElementById(ID).style.backgroundColor = dieInactive;
    }
    selectRoster = [false, false, false, false, false]
    console.log("Select roster: " + selectRoster)
}

// Takes a selected hand and calculates the potential score of that hand, given the rules
function calculateScore(selectedHand){

    var dice = selectedHand.sort().join("");
    console.log("sorted dice: " + dice);

    // switch(selectedHand) {
    //     case x:
    //       // code block
    //       break;
    //     case y:
    //       // code block
    //       break;
    //     default:
    //       // code block
    // } 
}