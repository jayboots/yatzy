import { YatzyGame } from "./yatzy_game.js";
import { ScoreCard } from  "./scorecard.js"

var game = null;
var scoreCard = null;
var targetChoice = null;
var targetPts = null;

var canRoll = false;
var gameOver = true; //TODO: implement, also maybe change to state\
var roundPts = 0; //TODO: implement

const dicePrefix = "d_";
const lockPrefix = "l_";

// Colour constants for mouse-over events
const defaultColour = "white"
const selectColour = "lightblue"
// const hoverColour = "lightgreen"
// const inactiveColour = "lightgray"

// Handles which dice are "selected" for score calculation
var selectRoster = [false, false, false, false, false]

window.onload=function(){
    console.log("Window loaded")

    const scoreTable = document.getElementsByClassName("table-row");
    for (let i = 0; i < scoreTable.length; i++) {
        let ID = scoreTable[i].id
        // document.getElementById(ID).addEventListener("mouseover", highlightElement, true)
        document.getElementById(ID).addEventListener("click", calculateScore, true)
    }
    
    const totalScore = document.getElementById("total-score");

    const rollBtn = document.getElementById("rollBtn");
    const endRoundBtn = document.getElementById("endRoundBtn");
    const resetBtn = document.getElementById("resetBtn");
    const stateBtn = document.getElementById("stateBtn");

    //TODO: Implement disabled on start until new game created
    endRoundBtn.disabled = true;
    rollBtn.disabled = true;

    // Event Listeners
    rollBtn.addEventListener("click", rollDice, true);
    endRoundBtn.addEventListener("click", endRound, true);
    resetBtn.addEventListener("click", resetGame, true);
    stateBtn.addEventListener("click", getGameState, true);

    // Load the locks
    const locks = document.getElementsByClassName("lock");
    for (let i = 0; i < locks.length; i++) {
        let ID = locks[i].id
        document.getElementById(ID).addEventListener("click", toggleLock, true);
    }

    // Loading the dice
    const dice = document.getElementsByClassName("die");
    for (let i = 0; i < dice.length; i++) {
        let ID = dice[i].id
        document.getElementById(ID).addEventListener("click", toggleDie, true);
    }

}

// function highlightElement(){
//     console.log(this.id)
//     document.getElementById(this.id).style.backgroundColor = "yellow";
// }

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
    console.log("targetChoice and targetPts: " + targetChoice + ", " + targetPts)
}


/**
 * Make a new game and reset some state variables and UI things.
 */
function resetGame(){
    console.log("Creating new game.")
    game = new YatzyGame();
    scoreCard = new ScoreCard();
    targetChoice = null;
    targetPts = null;
    drawScoreCard();

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
        deselectDice() // remove all selections

        //TODO: "Lock in" the scoreboard here
        updateScoreCard(); //commit the selected score to the scorecard
        targetChoice = null;
        targetPts = null;
        drawScoreCard(); //redraw the scorecard

        if (game.currentRound == (game.maxRounds)){
            gameOver = true;
            //TODO: Endgame logic, view score, try again, new game, etc.
            scoreCard.calculateBonus();
            //TODO: Update the scorecard here to reflect the final score

            rollBtn.disabled = true; //Can't roll dice if the game is over.
            console.log("GAME IS OVER. Can make a new game, if you want.")
        }
        else{
            game.resetDice() //new round = new dice, new rolls, no locks
            canRoll = true;
            drawDice(game.activeHand) //draw the reset
            drawLocks(game.lockRoster) //draw the locks here, when implemented
            rollBtn.disabled = false; //We're starting a new round so we need to be able to roll
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


/**
 * Handles the interaction between the UI dice selection mechanism and the selected hand of dice variables.
 */
function toggleDie(){
    if (game != null && !game.activeHand.includes(null)){
        let ID = this.id.split("_")[1];
        let die = document.getElementById(this.id);
        // console.log("Clicked die " + ID);

        // Manage the selection roster toggles
        selectRoster[ID] = ! selectRoster[ID];
        if (selectRoster[ID]){
            die.style.backgroundColor = selectColour;
        }
        else{
            die.style.backgroundColor = defaultColour;
        }
        // console.log("Active dice: " + selectRoster);
        //Refresh the scorecard when we toggle a selection
        drawScoreCard()
    }
}

/**
 * Deselects all dice and returns the colour to the default.
 * Sets the programmatic implementation of the selected dice to the default value (all dice unselected).
 */
function deselectDice(){
    // console.log("Deselecting dice")
    let dice = document.getElementsByClassName("die");
    for (let i = 0; i < dice.length; i++) {
        let ID = dice[i].id
        document.getElementById(ID).style.backgroundColor = defaultColour;
    }
    selectRoster = [false, false, false, false, false]
    // console.log("Select roster: " + selectRoster)
}

// Takes a selected hand and calculates the potential score of that hand, given the rules

/**
 * Calculates the score of whichever item is selected.
 */
function calculateScore(){
    if (game != null && !game.activeHand.includes(null)){
        if (selectRoster.includes(true)){
            // Update the selected hand
            let selectedHand = [];
            for (let i = 0; i < 5; i++) {
                if (selectRoster[i]){
                    selectedHand.push(game.activeHand[i]) ;
                }
            }
            // console.log("Selected hand: " + selectedHand);

            let scoreChoice = this.id
            let pts = 0;
            let stringDice = selectedHand.sort().join("");
            let pattern = null
            let outcomes = null

            let noMatchMsg = "No match. 0 pts for t his one..."

            switch(scoreChoice) {
                case "ones":
                    for (let i = 0; i < selectedHand.length; i++) {
                        if (selectedHand[i] == 1){
                            pts += 1
                        }
                    }
                    if (pts == 0){
                        console.log(noMatchMsg)
                    }
                    else{
                        console.log("This will give you " + pts + " points!")
                    }
                    break;
                case "twos":
                    for (let i = 0; i < selectedHand.length; i++) {
                        if (selectedHand[i] == 2){
                            pts += 2
                        }
                    }
                    if (pts == 0){
                        console.log(noMatchMsg)
                    }
                    else{
                        console.log("This will give you " + pts + " points!")
                    }
                    break;
                case "threes":
                    for (let i = 0; i < selectedHand.length; i++) {
                        if (selectedHand[i] == 3){
                            pts += 3
                        }
                    }
                    if (pts == 0){
                        console.log(noMatchMsg)
                    }
                    else{
                        console.log("This will give you " + pts + " points!")
                    }
                    break;
                case "fours":
                    for (let i = 0; i < selectedHand.length; i++) {
                        if (selectedHand[i] == 4){
                            pts += 4
                        }
                    }
                    if (pts == 0){
                        console.log(noMatchMsg)
                    }
                    else{
                        console.log("This will give you " + pts + " points!")
                    }
                    break;
                case "fives":
                    for (let i = 0; i < selectedHand.length; i++) {
                        if (selectedHand[i] == 5){
                            pts += 5
                        }
                    }
                    if (pts == 0){
                        console.log(noMatchMsg)
                    }
                    else{
                        console.log("This will give you " + pts + " points!")
                    }
                    break;
                case "sixes":
                    for (let i = 0; i < selectedHand.length; i++) {
                        if (selectedHand[i] == 6){
                            pts += 6
                        }
                    }
                    if (pts == 0){
                        console.log(noMatchMsg)
                    }
                    else{
                        console.log("This will give you " + pts + " points!")
                    }
                    break;
                case "onePair":
                    // Two dice showing the same number. Score: Sum of those two dice
                    if (selectedHand.length == 2){
                        pattern = /(\d)\1/g
                        outcomes = stringDice.match(pattern)
                        if (outcomes) {
                            pts = selectedHand.reduce((accumulator, currentValue) => {
                                return accumulator + currentValue
                              },0);
                            console.log("This will give you " + pts + " points!")
                        }
                        else{
                            console.log(noMatchMsg)
                        }
                    }
                    else{
                        console.log("You need to select *exactly* two dice to submit a pair!")
                    }
                    break;
                case "twoPairs":
                    if (selectedHand.length == 4){
                        pattern = /(?<first>(?<f>\d)(\k<f>)).*?(?!\k<f>)(?<second>(?<s>\d)(\k<s>))/g
                        outcomes = stringDice.match(pattern)
                        if (outcomes) {
                            pts = selectedHand.reduce((accumulator, currentValue) => {
                                return accumulator + currentValue
                              },0);
                            console.log("This will give you " + pts + " points!")
                        }
                        else{
                            console.log(noMatchMsg)
                        }
                    }
                    else{
                        console.log("You need to select four dice to submit two pairs.")
                    }
                    break;
                case "threeKind":
                    if (selectedHand.length == 3){
                        pattern = /(\d)\1{2}/g
                        outcomes = stringDice.match(pattern)
                        if (outcomes) {
                            pts = selectedHand.reduce((accumulator, currentValue) => {
                                return accumulator + currentValue
                            },0);
                            console.log("This will give you " + pts + " points!")
                        }
                        else{
                            console.log(noMatchMsg)
                        }
                    }
                    else{
                        console.log("You need to select three dice to score three of a kind.")
                    }
                    break;
                case "fourKind":
                    if (selectedHand.length == 4){
                        pattern = /(\d)\1{3}/g
                        outcomes = stringDice.match(pattern)
                        if (outcomes) {
                            pts = selectedHand.reduce((accumulator, currentValue) => {
                                return accumulator + currentValue
                            },0);
                            console.log("This will give you " + pts + " points!")
                        }
                        else{
                            console.log(noMatchMsg)
                        }
                    }
                    else{
                        console.log("You need to select four dice to score four of a kind.")
                    }
                    break;
                case "smallStraight":
                    // The combination 1-2-3-4-5. Score: 15 points (sum of all the dice)
                    pattern = /(12345)/g
                    outcomes = stringDice.match(pattern)
                    if (outcomes){
                        pts=15
                        console.log(outcomes + " gives you a small straight, and " + pts + " points!")
                    }
                    else{
                        console.log(noMatchMsg)
                    }
                    console.log(outcomes)
                    break;
                case "largeStraight":
                    // The combination 2-3-4-5-6. Score: 20 points (sum of all the dice).
                    pattern = /(23456)/g
                    outcomes = stringDice.match(pattern)
                    if (outcomes){
                        pts=20
                        console.log(outcomes + " gives you a large straight, and " + pts + " points!")
                    }
                    else{
                        console.log(noMatchMsg)
                    }
                    console.log(outcomes)
                    break;
                case "fullHouse":
                    if (selectedHand.length == 5){
                        pattern = /(?<first>\d)(\k<first>){2}\d?(?<second>(?!\k<first>)\d)(\k<second>)|(?<third>\d)(\k<third>)\d?(?<fourth>(?!\k<third>)\d)(\k<fourth>){2}/g
                        outcomes = stringDice.match(pattern)
                        if (outcomes) {
                            pts = selectedHand.reduce((accumulator, currentValue) => {
                                return accumulator + currentValue
                              },0);
                            console.log("This will give you " + pts + " points!")
                        }
                        else{
                            console.log(noMatchMsg)
                        }
                    }
                    else{
                        console.log("You need to select five dice to submit a full house.")
                    }
                    break;
                case "chance":
                    //Any combination of dice. Score: Sum of all the dice.
                    pts = selectedHand.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue
                      },0);
                    console.log("This will give you " + pts + " points")
                    break;
                case "yatzy":
                    if (selectedHand.length == 5){
                        pattern = /(\d)\1{4}/g
                        outcomes = stringDice.match(pattern)
                        if (outcomes) {
                            pts = 50;
                            console.log(outcomes + " gives you a yatzy! And 50 pts! Congrats")
                        }
                        else{
                            console.log(noMatchMsg)
                        }
                    }
                    else{
                        console.log("You need to select five dice to submit a yatzy.")
                    }
                    break;
                default:
                    console.log("Something went wrong. You selected: " + this.id)
                    // code block
                    break;
                //Update the turn pts variable then write it to the game when the turn ends
            } 

            if (scoreCard.records[scoreChoice] == null){
                showScoreChoice(scoreChoice, pts)
            }
            else{
                //TODO: Something
                console.log("This section is already filled")
            }
        }
        else{
            console.log("Need to select at least one die!")
        }
    }
    else {
        console.log("No game or no dice, cannot do anything with the scorecard!")
    }
}

function showScoreChoice(choice, pts){
    targetChoice = choice;
    targetPts = pts;
    let scoreTable = document.getElementsByClassName("table-row");
    // console.log(scoreTable)
    for (let i = 0; i < scoreTable.length; i++) {
        let ID = scoreTable[i].id
        let scoreArea = document.getElementById(ID).childNodes[3];
        if (document.getElementById(ID).id == targetChoice){
            // console.log("Show the score and highlight")
            scoreArea.innerText = pts;
        }
        else{
            // console.log("Reset these to saved state on the scorecard")
            scoreArea.innerText = scoreCard.records[document.getElementById(ID).id];
        }
    }
}

function drawScoreCard(){
    let scoreTable = document.getElementsByClassName("table-row");
    for (let i = 0; i < scoreTable.length; i++) {
        let ID = scoreTable[i].id
        let scoreArea = document.getElementById(ID).childNodes[3];
        scoreArea.innerText = scoreCard.records[document.getElementById(ID).id];
        }
    // TODO: Update the total score area
    // TODO: Also update an indicator of the bonus in the blank slot next to total, when it triggers.
}

function updateScoreCard(){
    if ((targetChoice != null) && (targetPts != null) &&(scoreCard.records[targetChoice] == null)){
        scoreCard.records[targetChoice] = targetPts
    }
    else{
        // Shouldn't see this message.
        console.log("Somehow, trying to over-write a pre-filled score box...")
    }
    console.log(scoreCard.records)
}