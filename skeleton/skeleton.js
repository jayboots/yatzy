// Handles the front-end requests
const apiRoot = '/yatzy/skeleton/app/models/';
const dice = 'Dice.php'
// const game = 'YatzyGame.php'
// const engine = 'YatzyEngine.php'

var activeHand = new Array(null, null, null, null, null);

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
    getDice().then(data =>{
        // console.log(data)
        testDice.innerHTML = 'Dice Array: [' + data + ']';
    });
}

async function getDice(){
    // console.log("Making a get request for a dice hand")
    // fetch(apiRoot+dice).then(function(response) {
    //     return response.json();
    // }).then(function(data){
    //     alert(data)
    // });
    let data = await fetch(apiRoot+dice).then(function(response) {
        return response.json();
    }).catch(error => {
        console.error("fetch error: ", error);
    });
    // console.log(data)
    return data
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


