// Variables for AJAX Requests - to be enabled as we AJAXify this script
const apiRoot = '/app/models/';
// const dice = 'Dice.php'
// const game = 'YatzyGame.php'
// const scoreCard = 'ScoreCard.php'
// const engine = 'YatzyEngine.php'
// const leaderBoard = 'score.php'

// Pre-existing Game Variables
var game = null;
var scoreCard = null;
var targetChoice = null;
var targetPts = null;

// UI Variables are used to handle drawing actions or UI behaviours only
var canRoll = false;
var gameOver = true;

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

// Handles which dice are "selected" for score calculation
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
    // resetBtn.addEventListener("click", resetGame, true);
    rollBtn.addEventListener("click", rollDice, true);
    // endRoundBtn.addEventListener("click", endRound, true);

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

}

// ================== UI FUNCTIONS ==================


/**
 * Rolls the dice according to the logic of the game.
 */
function rollDice(){
    console.log("Attempting to roll the dice...")
    // if (canRoll){
    //     game.rollDice();
    //     deselectDice(); //reset all selected dice when rolling
    //     var activeHand = game.activeHand;
    //     console.log(activeHand)
    //     drawDice(activeHand)

    //     if (game.rollsLeft == 0){
    //         canRoll = false;
    //         rollBtn.disabled = !canRoll;
    //     }
    // }
    // else{
    //     console.log("Cannot currently roll the dice.") //either game hasn't been created yet, or game logic doesn't allow this.
    //     //Disable the roll button in the DOM here
    // }
}

// ================= AJAX FUNCTIONS ================= 

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