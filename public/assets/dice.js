// Dice rolling mechanism and information about the current hand of dice

/**
 * Generates a random number between 1 and 6
 *
 * @return {Number} rollValue
 */
export function getRollValue(){
    let rollValue = Math.floor(Math.random() * 6) + 1;
    return rollValue;
}

/**
 * Determines the outcomes for a set of five dice,
 * returns these values as a numeric array, and
 * writes these outcomes to the console
 *
 * @return {Number[]} activeHand - The outcomes for a set of five dice
 */
export function rollDice(){
    let activeHand = new Array(null,null,null,null,null);
    for (let i = 0; i < activeHand.length; i++) {
        activeHand[i] = getRollValue();
    }
    console.log("Active hand: " + activeHand);
    return activeHand;
}