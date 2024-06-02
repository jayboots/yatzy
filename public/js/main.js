// Choose which die face to display by selecting a digit from 1-6

// Default set the "roll" hand to impossible values when no roll
// This could hold the values of the hand but we need a way to keep an expanding array of turns : outcomes to display in a table

// Will use to check if a die is locked or not
let lockedDice = [0,0,0,0,0];
// Initialize dice with non-usable values
let activeHand = [-1,-1,-1,-1,-1];

dicePrefix = "d_"
lockPrefix = "l_"

// Runs on page load
function initializeGame(){
    for (let i = 0; i < activeHand.length; i++) {
        // document.getElementById("d"+i).innerText = randomValue()
        document.getElementById(dicePrefix+i).innerText = "?"
      }
}

function randomValue(){
    let roll = Math.floor(Math.random() * 6) + 1;
    return roll;
}

function toggleLock(lockID){
    let ID = lockID.split("_")[1];
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

function rollDice(){
    for (let i = 0; i < lockedDice.length; i++) {
        // If the die is locked, don't change the value
        if (lockedDice[i] == 0) {
            // console.log("Die # " + (i + 1) + " is free. Rerolling value." );
            let roll = randomValue();
            activeHand[i] = roll;
            document.getElementById(dicePrefix+i).innerText = roll;
        } else {
            console.log("Die # " + (i + 1) + " is locked." )
        }
    }

    console.log("Active hand: " + activeHand)

    // Lock buttons should be hidden on first roll of any given turn. On subsequent turns, lock buttons should become unhidden to allow dice locking.

}

