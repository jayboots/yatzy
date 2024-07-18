const apiRoot = '/app/models/';

// UI Variables are used to handle drawing actions or UI behaviours only
// TODO: These can be read from YatzyEngine or YatzyGame...
var targetChoice = null;

var canSelect = false;

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

// Handles which dice are selected and locked by the UI. Passes this info via POST request to the API.
var selectRoster = [false, false, false, false, false]
var lockRoster = [false, false, false, false, false]

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
    resetBtn.disabled = true;

    // Event Listeners for the main game buttons
    resetBtn.addEventListener("click", resetGame, true);
    rollBtn.addEventListener("click", rollDice, true);
    endRoundBtn.addEventListener("click", endRound, true);

    // Event listener for the scorecard Scorecard
    for (let i = 0; i < scoreTable.length; i++) {
        let ID = scoreTable[i].id
        document.getElementById(ID).addEventListener("click", calculateScore, true)
    }

    // Event listeners for the locks
    for (let i = 0; i < locks.length; i++) {
        let ID = locks[i].id
        document.getElementById(ID).addEventListener("click", toggleLock, true);
    }

    // Event listeners for the dice
    for (let i = 0; i < dice.length; i++) {
        let ID = dice[i].id
        document.getElementById(ID).addEventListener("click", toggleDie, true);
    }

    resetBtn.disabled = false;
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
                drawScoreCard(data);
                document.getElementById("gameover-msg").innerText = "";
                // canRoll = true;
                // gameOver = false;

                // rollBtn.disabled = !canRoll;

                lockRoster = data["game"]["lockRoster"]
                drawDice(_activeHand=data["game"]["activeHand"], _lockRoster=data["game"]["lockRoster"])
                drawLocks(data["game"]["lockRoster"])
                deselectDice()

                // TODO: TORI - when this fires, set leaderboard status to hidden! :)
                

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

    var xhr = new XMLHttpRequest(); 
    xhr.responseType = "text";
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
            if (xhr.status == 200){ 
                let data = JSON.parse(xhr.responseText)
                // console.log(data)
                getGameState(data, false)
                deselectDice(); //reset all selected dice when rolling
                drawDice(_activeHand=data["game"]["activeHand"], _lockRoster=data["game"]["lockRoster"])
            }
            else if (xhr.status == 404){ //if resoure not found
                console.log(xhr.status + ": Could not roll dice. Resource not found.");
            }
            else {
                console.log("Something went wrong.")
            }
        }
    }

    xhr.open('POST', apiRoot+"YatzyEngine.php", true);

    xhr.setRequestHeader('Content-Type', 'application/json')
    // Then send request
    xhr.send(JSON.stringify({"locks": lockRoster}));
}

/**
 * Ends a round and triggers YatzyEngine to make determinations about game state changes and scores.
 */
function endRound(){
    
    if (!selectRoster.includes(true)){
        console.log("Please select at least one die")
    }
    else if (targetChoice == null){
        console.log("Please select a scoring category.")
    }
    else {
        // console.log("Clicked button to end round.")
        
        var xhr = new XMLHttpRequest(); 
        xhr.responseType = "text";
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
                if (xhr.status == 200 || xhr.status == 201){ 
                    //TODO: Complete this tomorrow morning
                    let data = JSON.parse(xhr.responseText)

                    drawScoreCard(data)
                    deselectDice()
                    getGameState(data)
                    drawDice(data["game"]["activeHand"], data["game"]["lockRoster"])


                    // Update our local copy...
                    lockRoster = data["game"]["lockRoster"]
                    drawLocks(data["game"]["lockRoster"])
                    // getGameState(data)
                    // Update the scorecard
                    console.log("Successfully submitted score!")

                    // And if we successfully submitted our last score...
                    if(data["game"]["maxRounds"] == data["game"]["currentRound"]) {
                        gameOver();
                    }

                }
                else if (xhr.status == 208){
                    console.log("Already scored in this slot...")
                }
                else if (xhr.status == 404){ //if resoure not found
                    console.log(xhr.status + ": Could not roll dice. Resource not found.");
                    endRoundBtn.disabled = false;
                }
            }
        }

        xhr.open('POST', apiRoot+"YatzyEngine.php", true);
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify({"selection": [selectRoster, targetChoice]}));
        
        // #TODO on YatzyEngine.php: 
        // game.incrementRound()
        // deselectDice() // remove all selections

        // //TODO: "Lock in" the scoreboard here
        // updateScoreCard(); //commit the selected score to the scorecard
        // targetChoice = null;

        // if (game.currentRound == (game.maxRounds)){
        //     gameOver = true;
        //     let bonus = scoreCard.calculateBonus();
        //     game.score += bonus;
        //     rollBtn.disabled = true; //Can't roll dice if the game is over.
        //     // console.log("GAME IS OVER. Can make a new game, if you want.")
        //     if (bonus != 0){
        //         document.getElementById("gameover-msg").innerText = "Game over! Bonus 50 pts!";
        //         document.getElementById("total-score").innerText = game.score;
        //     }
        //     else{
        //         document.getElementById("gameover-msg").innerText = "Game over!";
        //     }
        // }
        // else{
        //     game.resetDice() //new round = new dice, new rolls, no locks
        //     canRoll = true;
        //     drawDice(game.activeHand) //draw the reset
        //     drawLocks(game.lockRoster) //draw the locks here, when implemented
        //     rollBtn.disabled = false; //We're starting a new round so we need to be able to roll
        // }
        // //redraw the scorecard regardless of if final turn or not.
        // drawScoreCard();
    }
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
            if (lockedDice[i] == false) {
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
                // console.log("Die # " + (i + 1) + " is locked." )
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
    if (canSelect){
        let ID = this.id.split("_")[1];

        // Flip flip the lock state
        lockRoster[ID] = !lockRoster[ID];

        // Update the locks on the UI
        drawLocks(lockRoster)
    }
    else{
        console.log("This element cannot be clicked right now.")
    }
}

// TODO: TORI - when this fires, expose the leaderboard!
function gameOver(){
    console.log("Game over, man. Game over!");
    let name = window.prompt('Enter your name');
    let score = document.getElementById("total-score").innerText;
    submitScore(name, score)
}

/**
 * Given a roster of numbers, draws the corresponding lock states to the GUI
 *
 * @param {number[]} _lockRoster - array containing the lock state of each of the five dice
 */
function drawLocks(_lockRoster){
    for (let i = 0; i < _lockRoster.length; i++) {
        if (_lockRoster[i] != true){
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
    if (canSelect){
        // console.log("clicked a die")

        let ID = this.id.split("_")[1];
        let die = document.getElementById(this.id);

        // Manage the selection roster toggles
        selectRoster[ID] = ! selectRoster[ID];
        if (selectRoster[ID]){
            die.className = "die-selected";
            for (var i = 0; i < die.childNodes.length; i += 1) {
                die.childNodes[i].className = "dot-selected"
            }
        }
        else{
            die.className = "die-active";
            for (var i = 0; i < die.childNodes.length; i += 1) {
                die.childNodes[i].className = "dot"
            }
        }
        // console.log("Selected Dice: " + selectRoster)
        //Refresh the scorecard when we toggle a selection - TODO: Remove and swap for clicked-row highlighting!
        // drawScoreCard()
    }
    else{
        console.log("This element cannot be clicked right now.")
    }
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
    targetChoice = null;
    selectRoster = [false, false, false, false, false]

    // TODO: Maybe change this so locks persist turn over turn...
    // lockRoster = [false, false, false, false, false]
    // drawLocks(lockRoster)
    console.log("Deselected dice and erased any score target")
}


/**
 * Calculates the score of whichever item is selected.
 */
function calculateScore(){ //TODO: Move the core functionality over to YatzyEngine.php and convert this to a row highlighter
    if (canSelect){
        console.log("Clicked " + this.id);
        targetChoice = this.id;
    }
    else{
        console.log("This element cannot be clicked right now.")
    }
}

/**
 * Shows the potential score of any clicked row from the selected dice, without commiting the selection. Aka enables score preview in the scorecard.
 *
 * @param {*} choice - the selected score category
 * @param {*} pts - the number of points
 */
function showScoreChoice(choice, pts){
    // targetChoice = choice;
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
function drawScoreCard(data){
    // console.log("Drawing the scorecard")

    let scoreTable = document.getElementsByClassName("table-row");
    for (let i = 0; i < scoreTable.length; i++) {
        let ID = scoreTable[i].id
        let scoreArea = document.getElementById(ID).childNodes[3];

        scoreArea.innerText = data["game"]["scoreCard"]["records"][document.getElementById(ID).id];
        }

    let scoreSum = document.getElementById("total-score");
    scoreSum.innerText = data["game"]["scoreCard"]["score"];
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

/**
 * Reads some UI states and affects the UI accordingly (button toggles, etc.)
 * Additionally, writes some information about the state of the game to the console. 
 */
function getGameState(data, verbose=false){
    // Handle data from the get request
    // data = JSON.parse(data)
    game = data["game"]
    gameOver = data["gameOver"]

    console.log("Can select: " + canSelect)

    if (game == null){
        console.log("No active game object. Try starting a new game.")
    }
    else{
        let canRoll = (data["game"]["rollsLeft"] > 0 && data["game"]["currentRound"] < data["game"]["maxRounds"])
        rollBtn.disabled = !canRoll;
        
        let canSubmit = (data["game"]["rollsLeft"] < 3 && data["game"]["currentRound"] < data["game"]["maxRounds"])
        endRoundBtn.disabled = !canSubmit;

        let nullDice = (data["game"]["activeHand"].includes(null))
        canSelect = !nullDice
        if (verbose){
            console.log("Can end round: " + canSubmit)
            console.log("Can roll dice: " + canRoll)
            console.log("Can select elements: " + canSelect)
            console.log("Active hand: " + game['activeHand'])
            console.log("Lock Roster: " + game['lockRoster'])
        }
        console.log("Current round: " + game['currentRound'] + " / " + game['maxRounds'])
        console.log("Rolls available: " + game['rollsLeft'] + " / " + game['maxRolls'])
        // console.log("Current score: " + game.score) //
    }
    // TODO: Migrate these variables to YatzyEngine as they are state tracking variables
    // console.log("Game Currently Over: " + gameOver)
    console.log("targetChoice: " + targetChoice)
}