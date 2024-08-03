const modelsRoot = '/app/models/';
// const apiRoot = '/api/';

// UI Variables are used to handle drawing actions or UI behaviours only
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
// Exists to capture and pass on user input only.
var selectRoster = [false, false, false, false, false]
var lockRoster = [false, false, false, false, false]

// Items that are loaded
window.onload=function(){

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
        document.getElementById(ID).addEventListener("click", toggleRowSelect, true)
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

                data = JSON.parse(xhr.responseText)

                getGameState(data)
                targetChoice = null;
                drawScoreCard(data);
                document.getElementById("gameover-msg").innerText = "";

                lockRoster = data["game"]["lockRoster"]
                drawDice(_activeHand=data["game"]["activeHand"], _lockRoster=data["game"]["lockRoster"])
                drawLocks(data["game"]["lockRoster"])
                deselectDice()

                // set leaderboard to hidden
                const leaderboard = document.getElementById("leaderboard");
                leaderboard.style.display = "none";

            }
            else if (xhr.status == 404){ //if resoure not found
                console.log(xhr.status + ": Could not reset game. Resource not found.");
            }
        }
        else{
            pauseUI()
        }
    }

    xhr.open('get', modelsRoot+"YatzyEngine.php?new-game", true);

    // Then send request
    xhr.send();
}

/**
 * Handles the request for rolling dice and triggers updates to dice-related UI elements based on responses.
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
        else{
            pauseUI()
        }
    }

    xhr.open('POST', modelsRoot+"YatzyEngine.php", true);

    xhr.setRequestHeader('Content-Type', 'application/json')
    // Then send request
    xhr.send(JSON.stringify({"locks": lockRoster}));
}

/**
 * Ends a round and triggers YatzyEngine to make determinations about game state changes and scores.
 */
function endRound(){
    
    if (!selectRoster.includes(true)){
        console.log("Please select at least one die.")
    }
    if (targetChoice == null){
        console.log("Please select a scoring category.")
    }
    if (selectRoster.includes(true) && targetChoice != null) {
        // console.log("Clicked button to end round.")
        
        var xhr = new XMLHttpRequest(); 
        xhr.responseType = "text";
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4) {
                if (xhr.status == 200 || xhr.status == 201){ 

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
                        endGame();
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
            else{
                pauseUI()
            }
        }

        xhr.open('POST', modelsRoot+"YatzyEngine.php", true);
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify({"selection": [selectRoster, targetChoice]}));

    }
}


/**
 * Provides UI feedback when a request is processing.
 * Disables buttons while requests are processing to prevent spamming.
 */
function pauseUI(){
    console.log("Processing request. Please wait.")
    document.body.style.cursor = "wait";
    rollBtn.disabled = true;
    endRoundBtn.disabled = true;
    canSelect = false;
}

/**
 * Updates the values of the dice visuals.
 *
 * @param {*} _activeHand - array containing the values of the active hand
 * @param {*} _lockRoster - array containing the lock state of each of the five dice
 */
function drawDice(_activeHand, _lockRoster){

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
 * Handles the state of the locks in the UI
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

/**
 * Called when the game ends. Prompts user for their name,
 * saves their score, and displays the top 10 leaderboard.
 */
function endGame(){
    console.log("Game over, man. Game over!");

    let name = window.prompt('Enter your name');
    let score = document.getElementById("total-score").innerText;
    submitScore(name, score)
    
    //show leaderboard
    let leaderboard = document.getElementById("leaderboard");
    leaderboard.style.display = "inline";
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
    }
    else{
        console.log("This element cannot be clicked right now.")
    }
}

/**
 * Deselects all dice and returns the colour to the default.
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
    console.log("Deselected dice and erased any score target")
}


/**
 * Tracks which row has been clicked by the user in the scorecard and
 * manages the class state of the selected and unselected rows.
 */
function toggleRowSelect(){

    // Erase any previous coloured rows
    clearSelectedRows()

    // Then, see if we colour the one we've clicked
    if (canSelect){
        // console.log("Clicked " + this.id);
        targetChoice = this.id;
        let targetRow = document.getElementById(targetChoice)
        targetRow.className = "selected-table-row";
        console.log(targetRow)
    }
    else{
        console.log("This element cannot be clicked right now.")
    }
}


/**
 * Function to draw the score card information to the UI.
 *
 * @param {*} data - passed from GET request
 */
function drawScoreCard(data){
    // console.log("Drawing the scorecard")

    // Remove any selected rows when re-drawing the scorecard
    clearSelectedRows()

    let scoreTable = document.getElementsByClassName("table-row");
    for (let i = 0; i < scoreTable.length; i++) {
        let ID = scoreTable[i].id
        let scoreArea = document.getElementById(ID).childNodes[3];

        scoreArea.innerText = data["game"]["scoreCard"]["records"][document.getElementById(ID).id];
        }

    let scoreSum = document.getElementById("total-score");
    scoreSum.innerText = data["game"]["scoreCard"]["totalScore"];

    let bonusBox = document.getElementById("gameover-msg");
    if (data["game"]["scoreCard"]["bonus"] != 0 && bonusBox.innerText == ""){
        document.getElementById("gameover-msg").innerText = "🎉🎉 Bonus! +50 pts! 🎉🎉"
    }
}


/**
 * Function to visually de-select any rows in the scorecard by
 * reverting their CSS class to the default unselected state
 */
function clearSelectedRows(){
    let wholeTable = document.getElementById("score-card")
    // Erase any selected table rows
    for (let i = 0; i < 15; i++){
        wholeTable.childNodes[7].children[i].className = "table-row"
        // console.log(wholeTable.childNodes[7].children[i])
    }
}


/**
 * Gets leaderboard scores and names 
 *
 * @async
 * @param {*} name
 * @param {*} score
 * @returns {*}
 */
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
        name.innerHTML = score.username;
        result.innerHTML = score.score;
      })

  }).catch(error => {
        console.error("fetch error: ", error);
  });
}


/**
 * Handles information about the game state and optionally writes state information to the console.
 *
 * @param {*} data - data from a GET request
 * @param {boolean} [verbose=false] - toggles writing things to the console
 */
function getGameState(data, verbose=false){

    document.body.style.cursor = "auto";
    game = data["game"]

    if (verbose){
        console.log("Can select: " + canSelect)
    }

    if (game == null){
        if (verbose){
            console.log("No active game object. Try starting a new game.")
        }
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
            console.log("targetChoice: " + targetChoice)
            console.log("Current round: " + game['currentRound'] + " / " + game['maxRounds'])
            console.log("Rolls available: " + game['rollsLeft'] + " / " + game['maxRolls'])
            console.log("Current score: " + game.score)
        }
    }
}

function updateNavBar(){
    // TODO: Implement
    // Update the navbar to show/hide (enable/disable) certain buttons in the navbar in certain contexts, such as:
    // Login
    // Logout
    // Page Navigation
    // User Class...
}