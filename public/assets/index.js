const apiRoot = '/app/models/';

// UI Variables are used to handle drawing actions or UI behaviours only
// TODO: These can be read from YatzyEngine or YatzyGame...
var targetChoice = null;
var targetPts = null;

const dicePrefix = "d_";
const lockPrefix = "l_";
const shakePrefix = "s_";

// For drawing the dots on the dice
const dotPositionMatrix = {
    1: [[50, 50]],
    2: [[15, 15], [85, 85]],
    3: [[15, 15],[50, 50],[85, 85]],
    4: [[15, 15],[15, 85],[85, 15],[85, 85]],
    5: [[15, 15],[15, 85],[50, 50],[85, 15],[85, 85]],
    6: [[15, 15],[15, 85],[50, 15],[50, 85],[85, 15],[85, 85]]
};

// Handles which dice are "selected" for score calculation. Captured data passed along for scoring.
var selectRoster = [false, false, false, false, false]

// Items that are loaded
window.onload=function(){

    console.log("Window loaded. Initializing variables.")

    // Link interactive ui elements to variables
    const resetBtn = document.getElementById("resetBtn");
    const rollBtn = document.getElementById("rollBtn");
    const endRoundBtn = document.getElementById("endRoundBtn");
    const scoreTable = document.getElementsByClassName("table-row"); // The scoreing card
    const locks = document.getElementsByClassName("lock");
    const dice = document.getElementsByClassName("die-inactive");

    // Establish some states on page load by default.
    endRoundBtn.disabled = true;
    rollBtn.disabled = true;

    // Event Listeners for the main game buttons
    resetBtn.addEventListener("click", resetGame, true);
    rollBtn.addEventListener("click", rollDice, true);
    endRoundBtn.addEventListener("click", endRound, true);

    // // Event listener for the scorecard Scorecard
    // for (let i = 0; i < scoreTable.length; i++) {
    //     let ID = scoreTable[i].id
    //     document.getElementById(ID).addEventListener("click", calculateScore, true)
    // }

    // // "Submit Score" i.e. the "end round" button
    // endRoundBtn.addEventListener('click', function(event) {
    //     console.log("clicked");
    //     let name = window.prompt('Enter your name');
    //     const score = document.getElementById("total-score").innerText;
    //     submitScore(name, score);
    // }); 

    // // Event listeners for the locks
    // for (let i = 0; i < locks.length; i++) {
    //     let ID = locks[i].id
    //     document.getElementById(ID).addEventListener("click", toggleLock, true);
    // }

    // // Event listeners for the dice
    // for (let i = 0; i < dice.length; i++) {
    //     let ID = dice[i].id
    //     document.getElementById(ID).addEventListener("click", toggleDie, true);
    // }

    const testBtn = document.getElementById("testBtn");
    testBtn.addEventListener("click", testFunc, true);

    console.log("All variables initialized.")

}

// ================== UI FUNCTIONS ==================

/**
 * Make a new game via an AJAX call and reset some GUI features and functions.
 */
function resetGame(){
    //Create an AJAX object
    var xhr = new XMLHttpRequest(); 
    xhr.responseType = "text";
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
            if (xhr.status == 200){ 
                // console.log(xhr.responseText);
                // TODO: Do something here...
                console.log(xhr.status + ": Creating new game.")

                data = JSON.parse(xhr.responseText)
                getGameState(data)

                targetChoice = null;
                targetPts = null;
                // drawScoreCard();
                document.getElementById("gameover-msg").innerText = "";
                // canRoll = true;
                // gameOver = false;

                // rollBtn.disabled = !canRoll;

                drawDice(_activeHand=data["game"]["activeHand"], _lockRoster=data["game"]["lockRoster"])
                // drawLocks(data["game"]["lockRoster"])
                // deselectDice()
            }
            else if (xhr.status == 404){ //if resoure not found
                console.log(xhr.status + ": Could not reset game. Resource not found.");
            }
        }
    }

    xhr.open('get', apiRoot+"YatzyEngine.php?new-game", true);

    // Then send request
    xhr.send();
}

/**
 * Rolls the dice according to the logic of the game.
 */
function rollDice(){
    console.log("Attempting to roll the dice...")

    // TODO: Migrate canRoll functionality to YatzyEngine...

    var xhr = new XMLHttpRequest(); 
    xhr.responseType = "text";
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
            if (xhr.status == 200){ 
                let data = JSON.parse(xhr.responseText)
                getGameState(data)
                deselectDice(); //reset all selected dice when rolling
                drawDice(_activeHand=data["game"]["activeHand"], _lockRoster=data["game"]["lockRoster"])
            }
            else if (xhr.status == 404){ //if resoure not found
                console.log(xhr.status + ": Could not roll dice. Resource not found.");
            }
        }
    }

    xhr.open('get', apiRoot+"YatzyEngine.php?roll-dice", true);

    // Then send request
    xhr.send();
}

/**
 * Ends a round and determines whether the round ending means the game has finished or not.
 */
function endRound(){
    console.log("Clicked button to end round.")
    // TODO: Implement api calls and the scoring functionality of SubmitScore
    //Turn off this button after it is pressed, because:
    // - either a minimum of 1 roll is required before ending the next turn, or
    // - the game is over (i.e. this was the last round)
    // endRoundBtn.disabled = true;

    // if (game != null){
    //     game.incrementRound()
    //     deselectDice() // remove all selections

    //     //TODO: "Lock in" the scoreboard here
    //     updateScoreCard(); //commit the selected score to the scorecard
    //     targetChoice = null;
    //     targetPts = null;

    //     if (game.currentRound == (game.maxRounds)){
    //         gameOver = true;
    //         let bonus = scoreCard.calculateBonus();
    //         game.score += bonus;
    //         rollBtn.disabled = true; //Can't roll dice if the game is over.
    //         // console.log("GAME IS OVER. Can make a new game, if you want.")
    //         if (bonus != 0){
    //             document.getElementById("gameover-msg").innerText = "Game over! Bonus 50 pts!";
    //             document.getElementById("total-score").innerText = game.score;
    //         }
    //         else{
    //             document.getElementById("gameover-msg").innerText = "Game over!";
    //         }
            
    //     }
    //     else{
    //         game.resetDice() //new round = new dice, new rolls, no locks
    //         canRoll = true;
    //         drawDice(game.activeHand) //draw the reset
    //         drawLocks(game.lockRoster) //draw the locks here, when implemented
    //         rollBtn.disabled = false; //We're starting a new round so we need to be able to roll
    //     }
    //     //redraw the scorecard regardless of if final turn or not.
    //     drawScoreCard(); 
    // }
}


/**
 * Updates the values of the dice visuals.
 *
 * @param {*} _activeHand - array containing the values of the active hand
 * @param {*} _lockRoster - array containing the lock state of each of the five dice
 */
function drawDice(_activeHand, _lockRoster){
    // console.log(_activeHand)
    // console.log(_lockRoster)
    if (_activeHand.includes(null)){
        for (let i = 0; i < _activeHand.length; i++) {
            document.getElementById(dicePrefix+i).innerText = "?";
            document.getElementById(dicePrefix+i).className = "die-inactive";
            document.getElementById(dicePrefix+i).title = "Die " + (i+1) + " has no value.";
        }
    }
    else{
        let lockedDice = _lockRoster;
        // console.log("Updated the drawn dice")
        for (let i = 0; i < lockedDice.length; i++) {
            // If the die is locked, don't change the drawn value
            document.getElementById(dicePrefix+i).className = "die-active";
            if (lockedDice[i] == 0) {
                let rollContainer = document.getElementById(shakePrefix+i);
                if (document.getElementById(dicePrefix+i).className == "die-active"){
                    rollContainer.style.animationName = "none";
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                        rollContainer.style.animationName = ""
                        }, 0);
                    });
                }
                // animation-iteration-count:
                document.getElementById(dicePrefix+i).innerText = "";
                document.getElementById(dicePrefix+i).title = "Die " + (i+1) + " has a value of " + _activeHand[i] + ".";
            } else {
                //No need to redraw any locked dice.
                console.log("Die # " + (i + 1) + " is locked." )
            }
            let dotList = dotPositionMatrix[_activeHand[i]]
            for (let j = 0; j < dotList.length; j++) {
                let dotCoords = dotList[j]
                let dot = document.createElement("div")
                dot.style.setProperty("--top", dotCoords[0] + "%")
                dot.style.setProperty("--left", dotCoords[1] + "%")
                dot.classList.add("dot")
                document.getElementById(dicePrefix+i).appendChild(dot)
            }
        }
    }
}

/**
 * Handles the interaction between the UI lock interface(s) and the YatzyGame lockRoster
 */
function toggleLock(){
    // let ID = this.id.split("_")[1];
    // console.log("Clicked lock " + ID)
    // // Check lock status then invert it, provided there is a game and no null values in the turn
    // if ((game != null) && (!game.activeHand.includes(null))){
    //     if (game.lockRoster[ID] == 0){
    //         // If unlocked, lock
    //         game.lockRoster[ID] = 1;
    //         console.log("Locking die " + (1 + parseInt(ID)))
    //    }
    //    else {
    //        // If locked, unlock
    //         game.lockRoster[ID] = 0;
    //         console.log("Unlocking die " + (1 +  parseInt(ID)))
    //    }
    //    drawLocks(game.lockRoster)
    //    console.log("Lock roster: " + game.lockRoster)
    // }
    // else{
    //     //TODO: Disable the locks in the GUI when they can't be used.
    //     console.log("...but the locks can't be used right now.")
    // }
}

/**
 * Given a roster of numbers, draws the corresponding lock states to the GUI
 *
 * @param {number[]} _lockRoster - array containing the lock state of each of the five dice
 */
function drawLocks(_lockRoster){
    for (let i = 0; i < _lockRoster.length; i++) {
        if (_lockRoster[i] == 0){
            document.getElementById(lockPrefix+i).innerHTML = '<i class="material-icons" style="font-size:3rem;">lock_open</i>'
        }
        else {
            document.getElementById(lockPrefix+i).innerHTML = '<i class="material-icons" style="font-size:3rem;">lock</i>';
        }
    }
}


/**
 * Handles the interaction between the UI dice selection mechanism and the selected hand of dice variables.
 */
function toggleDie(){
    // if (game != null && !game.activeHand.includes(null)){
    //     let ID = this.id.split("_")[1];
    //     let die = document.getElementById(this.id);

    //     // Manage the selection roster toggles
    //     selectRoster[ID] = ! selectRoster[ID];
    //     if (selectRoster[ID]){

    //         die.className = "die-selected";
    //         for (var i = 0; i < die.childNodes.length; i += 1) {
    //             die.childNodes[i].className = "dot-selected"
    //         }
    //     }
    //     else{
    //         die.className = "die-active";
    //         for (var i = 0; i < die.childNodes.length; i += 1) {
    //             die.childNodes[i].className = "dot"
    //         }
    //     }
    //     //Refresh the scorecard when we toggle a selection
    //     drawScoreCard()
    // }
}

/**
 * Deselects all dice and returns the colour to the default.
 * Sets the programmatic implementation of the selected dice to the default value (all dice unselected).
 */
function deselectDice(){
    let dice = document.getElementsByClassName("die-active");

    for (let i = 0; i < dice.length; i++) {

        let ID = dice[i].id
        document.getElementById(ID).className = "die-inactive";

        for (var j = 0; j < document.getElementById(ID).childNodes.length; j += 1) {
            document.getElementById(ID).childNodes[j].className = "dot"
        }
    }

    selectRoster = [false, false, false, false, false]
}


/**
 * Calculates the score of whichever item is selected.
 */
function calculateScore(){ //TODO: Move the core functionality over to YatzyEngine.php
    // if (game != null && !game.activeHand.includes(null)){
    //     if (selectRoster.includes(true)){
    //         // Update the selected hand
    //         let selectedHand = [];
    //         for (let i = 0; i < 5; i++) {
    //             if (selectRoster[i]){
    //                 selectedHand.push(game.activeHand[i]) ;
    //             }
    //         }
    //         // console.log("Selected hand: " + selectedHand);

    //         let scoreChoice = this.id
    //         let pts = 0;
    //         let stringDice = selectedHand.sort().join("");
    //         let pattern = null
    //         let outcomes = null

    //         let noMatchMsg = "No match. 0 pts for t his one..."

    //         switch(scoreChoice) {
    //             case "ones":
    //                 for (let i = 0; i < selectedHand.length; i++) {
    //                     if (selectedHand[i] == 1){
    //                         pts += 1
    //                     }
    //                 }
    //                 if (pts == 0){
    //                     console.log(noMatchMsg)
    //                 }
    //                 else{
    //                     console.log("This will give you " + pts + " points!")
    //                 }
    //                 break;
    //             case "twos":
    //                 for (let i = 0; i < selectedHand.length; i++) {
    //                     if (selectedHand[i] == 2){
    //                         pts += 2
    //                     }
    //                 }
    //                 if (pts == 0){
    //                     console.log(noMatchMsg)
    //                 }
    //                 else{
    //                     console.log("This will give you " + pts + " points!")
    //                 }
    //                 break;
    //             case "threes":
    //                 for (let i = 0; i < selectedHand.length; i++) {
    //                     if (selectedHand[i] == 3){
    //                         pts += 3
    //                     }
    //                 }
    //                 if (pts == 0){
    //                     console.log(noMatchMsg)
    //                 }
    //                 else{
    //                     console.log("This will give you " + pts + " points!")
    //                 }
    //                 break;
    //             case "fours":
    //                 for (let i = 0; i < selectedHand.length; i++) {
    //                     if (selectedHand[i] == 4){
    //                         pts += 4
    //                     }
    //                 }
    //                 if (pts == 0){
    //                     console.log(noMatchMsg)
    //                 }
    //                 else{
    //                     console.log("This will give you " + pts + " points!")
    //                 }
    //                 break;
    //             case "fives":
    //                 for (let i = 0; i < selectedHand.length; i++) {
    //                     if (selectedHand[i] == 5){
    //                         pts += 5
    //                     }
    //                 }
    //                 if (pts == 0){
    //                     console.log(noMatchMsg)
    //                 }
    //                 else{
    //                     console.log("This will give you " + pts + " points!")
    //                 }
    //                 break;
    //             case "sixes":
    //                 for (let i = 0; i < selectedHand.length; i++) {
    //                     if (selectedHand[i] == 6){
    //                         pts += 6
    //                     }
    //                 }
    //                 if (pts == 0){
    //                     console.log(noMatchMsg)
    //                 }
    //                 else{
    //                     console.log("This will give you " + pts + " points!")
    //                 }
    //                 break;
    //             case "onePair":
    //                 // Two dice showing the same number. Score: Sum of those two dice
    //                 if (selectedHand.length == 2){
    //                     pattern = /(\d)\1/g
    //                     outcomes = stringDice.match(pattern)
    //                     if (outcomes) {
    //                         pts = selectedHand.reduce((accumulator, currentValue) => {
    //                             return accumulator + currentValue
    //                           },0);
    //                         console.log("This will give you " + pts + " points!")
    //                     }
    //                     else{
    //                         console.log(noMatchMsg)
    //                     }
    //                 }
    //                 else{
    //                     console.log("You need to select *exactly* two dice to submit a pair!")
    //                 }
    //                 break;
    //             case "twoPairs":
    //                 if (selectedHand.length == 4){
    //                     pattern = /(?<first>(?<f>\d)(\k<f>)).*?(?!\k<f>)(?<second>(?<s>\d)(\k<s>))/g
    //                     outcomes = stringDice.match(pattern)
    //                     if (outcomes) {
    //                         pts = selectedHand.reduce((accumulator, currentValue) => {
    //                             return accumulator + currentValue
    //                           },0);
    //                         console.log("This will give you " + pts + " points!")
    //                     }
    //                     else{
    //                         console.log(noMatchMsg)
    //                     }
    //                 }
    //                 else{
    //                     console.log("You need to select four dice to submit two pairs.")
    //                 }
    //                 break;
    //             case "threeKind":
    //                 if (selectedHand.length == 3){
    //                     pattern = /(\d)\1{2}/g
    //                     outcomes = stringDice.match(pattern)
    //                     if (outcomes) {
    //                         pts = selectedHand.reduce((accumulator, currentValue) => {
    //                             return accumulator + currentValue
    //                         },0);
    //                         console.log("This will give you " + pts + " points!")
    //                     }
    //                     else{
    //                         console.log(noMatchMsg)
    //                     }
    //                 }
    //                 else{
    //                     console.log("You need to select three dice to score three of a kind.")
    //                 }
    //                 break;
    //             case "fourKind":
    //                 if (selectedHand.length == 4){
    //                     pattern = /(\d)\1{3}/g
    //                     outcomes = stringDice.match(pattern)
    //                     if (outcomes) {
    //                         pts = selectedHand.reduce((accumulator, currentValue) => {
    //                             return accumulator + currentValue
    //                         },0);
    //                         console.log("This will give you " + pts + " points!")
    //                     }
    //                     else{
    //                         console.log(noMatchMsg)
    //                     }
    //                 }
    //                 else{
    //                     console.log("You need to select four dice to score four of a kind.")
    //                 }
    //                 break;
    //             case "smallStraight":
    //                 // The combination 1-2-3-4-5. Score: 15 points (sum of all the dice)
    //                 pattern = /(12345)/g
    //                 outcomes = stringDice.match(pattern)
    //                 if (outcomes){
    //                     pts=15
    //                     console.log(outcomes + " gives you a small straight, and " + pts + " points!")
    //                 }
    //                 else{
    //                     console.log(noMatchMsg)
    //                 }
    //                 // console.log(outcomes)
    //                 break;
    //             case "largeStraight":
    //                 // The combination 2-3-4-5-6. Score: 20 points (sum of all the dice).
    //                 pattern = /(23456)/g
    //                 outcomes = stringDice.match(pattern)
    //                 if (outcomes){
    //                     pts=20
    //                     console.log(outcomes + " gives you a large straight, and " + pts + " points!")
    //                 }
    //                 else{
    //                     console.log(noMatchMsg)
    //                 }
    //                 // console.log(outcomes)
    //                 break;
    //             case "fullHouse":
    //                 if (selectedHand.length == 5){
    //                     pattern = /(?<first>\d)(\k<first>){2}\d?(?<second>(?!\k<first>)\d)(\k<second>)|(?<third>\d)(\k<third>)\d?(?<fourth>(?!\k<third>)\d)(\k<fourth>){2}/g
    //                     outcomes = stringDice.match(pattern)
    //                     if (outcomes) {
    //                         pts = selectedHand.reduce((accumulator, currentValue) => {
    //                             return accumulator + currentValue
    //                           },0);
    //                         console.log("This will give you " + pts + " points!")
    //                     }
    //                     else{
    //                         console.log(noMatchMsg)
    //                     }
    //                 }
    //                 else{
    //                     console.log("You need to select five dice to submit a full house.")
    //                 }
    //                 break;
    //             case "chance":
    //                 //Any combination of dice. Score: Sum of all the dice.
    //                 pts = selectedHand.reduce((accumulator, currentValue) => {
    //                     return accumulator + currentValue
    //                   },0);
    //                 console.log("This will give you " + pts + " points")
    //                 break;
    //             case "yatzy":
    //                 if (selectedHand.length == 5){
    //                     pattern = /(\d)\1{4}/g
    //                     outcomes = stringDice.match(pattern)
    //                     if (outcomes) {
    //                         pts = 50;
    //                         console.log(outcomes + " gives you a yatzy! And 50 pts! Congrats")
    //                     }
    //                     else{
    //                         console.log(noMatchMsg)
    //                     }
    //                 }
    //                 else{
    //                     console.log("You need to select five dice to submit a yatzy.")
    //                 }
    //                 break;
    //             default:
    //                 console.log("Something went wrong. You selected: " + this.id)
    //                 // code block
    //                 break;
    //             //Update the turn pts variable then write it to the game when the turn ends
    //         } 

    //         if (scoreCard.records[scoreChoice] == null){
    //             showScoreChoice(scoreChoice, pts)
    //             console.log("Unlocking the 'Finish Turn' button")
    //             endRoundBtn.disabled = false;
    //         }
    //         else{
    //             //TODO: Something
    //             console.log("This section is already filled")
    //         }
    //     }
    //     else{
    //         console.log("Need to select at least one die!")
    //     }
    // }
    // else {
    //     console.log("No game or no dice, cannot do anything with the scorecard!")
    // }
}


/**
 * Shows the potential score of any clicked row from the selected dice, without commiting the selection. Aka enables score preview in the scorecard.
 *
 * @param {*} choice - the selected score category
 * @param {*} pts - the number of points
 */
function showScoreChoice(choice, pts){
    // targetChoice = choice;
    // targetPts = pts;
    // let scoreTable = document.getElementsByClassName("table-row");

    // for (let i = 0; i < scoreTable.length; i++) {
    //     let ID = scoreTable[i].id
    //     let scoreArea = document.getElementById(ID).childNodes[3];
    //     if (document.getElementById(ID).id == targetChoice){
    //         // console.log("Show the score and highlight")
    //         scoreArea.innerText = pts;
    //     }
    //     else{
    //         // console.log("Reset these to saved state on the scorecard")
    //         scoreArea.innerText = scoreCard.records[document.getElementById(ID).id];
    //     }
    // }
}


/**
 * Function to draw the score card information to the UI.
 */
function drawScoreCard(){
    // let scoreTable = document.getElementsByClassName("table-row");
    // for (let i = 0; i < scoreTable.length; i++) {
    //     let ID = scoreTable[i].id
    //     let scoreArea = document.getElementById(ID).childNodes[3];
    //     scoreArea.innerText = scoreCard.records[document.getElementById(ID).id];
    //     }
    // let scoreSum = document.getElementById("total-score");
    // scoreSum.innerText = game.score;
}

/**
 * Updates the programatically-stored score card values, and updates the ongoing total score in the YatzyGame object.
 */
function updateScoreCard(){
    // if ((targetChoice != null) && (targetPts != null) &&(scoreCard.records[targetChoice] == null)){
    //     scoreCard.records[targetChoice] = targetPts
    //     game.score += targetPts;
    // }
    // else{
    //     // Shouldn't see this message.
    //     console.log("Somehow, trying to over-write a pre-filled score box...")
    // }
}


// ================ AJAX FUNCTIONS ================= 

/**
 * Function to simplify making GET requests to a specified URL, with an optional number of parameters
 *
 * @param {*} _url - the URL
 * @param {string} [_params=""] - (Optional) Parameters can be a string or an array of strings. 
 */
async function getRequest(_url, _params="", _func=null){

    let url = _url
    var params;
    if (Array.isArray(_params)){
        // params = _params.flatMap((x) => '?'+x).join('&');
        params = "?"+_params.join('&');
    }
    else if (_params == "") {
        var params = ""
    }
    else {
        params = '?'+_params;
    }

    //Create an AJAX object
    var xhr = new XMLHttpRequest(); 

    //State of the request - 0 unsent, 1 opened, 2 headers recieved, 3 loading, 4 done.
    // console.log("Ready State: " + xhr.readyState); 

    xhr.responseType = "text";
    
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
            // request has completed, so we have a response.
            if (xhr.status == 200){ //if request successful
                // console.log(xhr.responseText);
                // Call some function here with the response data... which is presumably what we'll want to do a lot of.
                if (_func){
                    console.log("Passing response data to specified function " + _func + "()")
                    window[_func](xhr.responseText);
                }
                else{
                    console.log("No function was passed...")
                }
            }
            else if (xhr.status == 404){ //if resoure not found
                console.log("Resource not found.");
            }
        }
    }

    // Now make the request (request type, resource path, async (true / false))
    xhr.open('get', url+params, true);

    // Then send request
    xhr.send();

}

//gets leaderboard scores and names 
async function submitScore(name, score) {
  //request setup
  const url = '/score';
  const jsonData = { name, score };
  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json' 
      },
      body: JSON.stringify(jsonData) 
  };

  //get data from api and update html page
  fetch(url, options).then(response => {
      if (!response.ok) {
          throw new Error("failed with: "+ response.status);
      }
      return response.json();

  }).then(data => {
      let scoreData = JSON.parse(JSON.stringify(data));
      let scoreboard = document.getElementById("scores");
      //delete current scoreboard
      scoreboard.innerHTML = '';

      //update scoreboard with new scores
      console.log(scoreData);
      scoreData.map((score, index) => {
          let row = scoreboard.insertRow(-1);
          let rank = row.insertCell(0);
          let name = row.insertCell(1);
          let result = row.insertCell(2);
          rank.innerHTML = index+1;
          name.innerHTML = score.name;
          result.innerHTML = score.score;
      })

  }).catch(error => {
      console.error("fetch error: ", error);
  });
}

// ============= DEVELOPMENT FUNCTIONS ============= 

/**
 * Writes some information about the state of the game to the console. Reads some UI states and affects the UI accordingly (button toggles, etc.)
 */
function getGameState(data, verbose=false){
    // Handle data from the get request
    // data = JSON.parse(data)
    game = data["game"]
    gameOver = data["gameOver"]

    if (game == null){
        console.log("No active game object. Try starting a new game.")
    }
    else{
        let canRoll = (data["game"]["rollsLeft"] > 0 && data["game"]["currentRound"] < data["game"]["maxRounds"])
        rollBtn.disabled = !canRoll;
        let canSubmit = (data["game"]["rollsLeft"] < 3 && data["game"]["currentRound"] < data["game"]["maxRounds"])
        endRoundBtn.disabled = !canSubmit;
        if (verbose){
            console.log("Can end round: " + canSubmit)
            console.log("Can roll dice: " + canRoll)
            console.log("Active hand: " + game['activeHand'])
            console.log("Lock Roster: " + game['lockRoster'])
        }
        console.log("Current round: " + game['currentRound'] + " / " + game['maxRounds'])
        console.log("Rolls available: " + game['rollsLeft'] + " / " + game['maxRolls'])
        console.log("Current score: " + game.score) //
    }
    // TODO: Migrate these variables to YatzyEngine as they are state tracking variables
    // console.log("Game Currently Over: " + gameOver)
    console.log("targetChoice and targetPts: " + targetChoice + ", " + targetPts)
}

// Test function to show that API call data is being passed along
function helloWorld(data){
    console.log("Hello, world!")
    console.log(data)
}

function secondaryFunc(data){
    data = JSON.parse(data)
    // console.log(typeof(data))
    // console.log(Object.keys(data))
    console.log(data["game"])
    // console.log(data)
}

function testFunc(){
    // getRequest(apiRoot+dice, ['roll', 'foo', 'bar'])
    // getRequest(_url=apiRoot+'Dice.php', _params='roll', _func='helloWorld')
    // getRequest(_url=apiRoot+'YatzyEngine.php', _params='info', _func='getGameState')
    getRequest(_url=apiRoot+'YatzyEngine.php', _params='info', _func='secondaryFunc')
}
