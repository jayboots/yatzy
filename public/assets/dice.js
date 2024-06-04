// Dice rolling mechanism

// Initialize some variables
let activeHand = [null,null,null,null,null];

/**
 * Generates a random number between 1 and 6
 *
 * @return {Number} rollValue
 */
function getRollValue(){
    let rollValue = Math.floor(Math.random() * 6) + 1;
    return rollValue;
}

/**
 * Determines the outcomes for a set of five dice,
 * returns these values as a numeric array, and
 * writes these outcomes to the console
 *
 * @param {Number[]} lockedDice - An array that represents the lock state of each die.
 * @return {Number[]} activeHand - The outcomes for a set of five dice
 */

function rollDice(lockedDice){
    for (let i = 0; i < lockedDice.length; i++) {
        if (lockedDice[i] == 0) {
            console.log("Die # " + (i + 1) + " is free. Rolling value." );
            let roll = getRollValue();
            activeHand[i] = roll;
        } else {
            // If the die is locked, don't change the value
            console.log("Die # " + (i + 1) + " is locked. Preserving previous value" );
        }
    }
    console.log("Active hand: " + activeHand);
    return activeHand;
}

// Roll five hands
rollDice([0,0,0,0,0]);
rollDice([0,0,0,0,1]);
rollDice([0,0,0,1,1]);
rollDice([1,1,1,1,1]);
rollDice([0,0,0,0,0]);