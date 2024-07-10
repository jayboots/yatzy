// Handles the front-end requests
const apiRoot = '/skeleton/app/models/';
const dice = 'Dice.php'
// const game = 'YatzyGame.php'
// const engine = 'YatzyEngine.php'

window.onload=function(){
    console.log("Window loaded")
    
    const resetBtn = document.getElementById("resetBtn");
    const rollBtn = document.getElementById("rollBtn");
    const endRoundBtn = document.getElementById("endRoundBtn");
    const testDice = document.getElementById("testDice");

    // endRoundBtn.disabled = true;
    // rollBtn.disabled = true;

    // Event Listeners
    rollBtn.addEventListener("click", rollDice, true);
    endRoundBtn.addEventListener("click", endRound, true);
    resetBtn.addEventListener("click", resetGame, true);
}

function rollDice(){
    // get the dice values by making an async request
    // then handle the GUI stuff in a call to another function like drawDice()...
    getDice();
    testDice.innerHTML = 'Dice Array: [UPDATED DICE]'
}

async function getDice(){
    fetch(apiRoot+dice+"$hand").then(function(data) {
        console.log(data)
    })
    console.log("Making a get request for a dice hand")
}

function postDice(){
    console.log("Sending data on the dice hand.")
}

function endRound(){
    console.log("Make an AJAX request to end the round.")
}

function resetGame(){
    console.log("Make an AJAX request to create a new game.")
}


