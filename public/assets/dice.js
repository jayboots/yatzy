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
 * @return {Number[]} newHand - The outcomes for a set of five dice
 */
export function getNewHand(){
    let newHand = new Array(getRollValue(), getRollValue(), getRollValue(), getRollValue(), getRollValue());
    console.log("New hand: " + newHand);
    return newHand;
}