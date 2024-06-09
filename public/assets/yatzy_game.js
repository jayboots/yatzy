import { getNewHand } from "./dice.js";

/**
 * Comprises information about game rounds ("turns"), rolls available per turn, the value of the active hand of dice, and the lock state of each die in the active hand.
 *
 * @class YatzyGame
 * @typedef {YatzyGame}
 */
class YatzyGame {
    
    /**
     * Creates an instance of YatzyGame.
     *
     * @constructor
     * @param {number} [_maxRolls=3] - The number of re-rolls per turn.
     * @param {number} [_maxRounds=13] - The number of rounds in the game
     * @param {number} [_numPlayers=1] - The number of players
     */
    constructor(_maxRolls=3, _maxRounds=13, _numPlayers=1) {

        // console.log("Creating Instance of YatzyGame")

        //INSTANCE VARIABLES
        this.maxRolls = _maxRolls;
        this.maxRounds = _maxRounds;
        this.numPlayers = _numPlayers;
        this.roundStart = 1;
        
        //Instantiate empty hand and no locked dice when creating a new game
        this.activeHand = new Array(null, null, null, null, null);
        this.lockRoster = new Array(0,0,0,0,0);

        //Ticker variables
        this.currentRound = this.roundStart;
        this.rollsLeft = this.maxRolls;

        //Since 2P is not being included, commenting this out as we remove this feature from our code base.
        // this.isPlayerOne = new Boolean(true)

    }
    
    /**
     * Updates the lock roster of dice according to the logical constraints of the game. Used to lock and unlock dice.
     *
     * @type {number[]} _lockRoster - numerical array containing the lock state of each "die" in the current hand
     */
    updateLockRoster(_lockRoster){
        if (this.rollsLeft < this.maxRolls || this.rollsLeft <= 0) {
            console.log("Updating the lock roster: " + lockRoster)
            this.lockRoster = _lockRoster;
        }
        else {
            console.log("Locking the dice is disabled on this turn.")
        }
    }

    /**
     * Increases the value of currentRound by 1, provided the state of the game logically allows for this increase. When a round increases, a "turn" has ended.
     */
    incrementRound(){
        if (this.currentRound < this.maxRounds){
            if ((this.rollsLeft == this.maxRolls) || (this.activeHand.includes(null))){
                let oldRound = this.currentRound;
                this.currentRound += 1;
                console.log("Changing round from " + oldRound + " to " + this.currentRound)
                this.resetDice()// ability to do this at the start of a round
                                // is why we don't use a setter for the lockRoster
            }
            else {
                // Controls of game should make it impossible to reach this state. There should be at least 1 roll before ending a round, and if there has been at least 1 roll there should be no null values i.e. unrolled dice in the active hand.
                console.log("Need to roll the dice at least once before a round can end.")
            }
        }
        else{
            // i.e. the game is over...
            console.log("The current round cannot exceed the maximum number of rounds")
        }
    }
    
    /**
     * Sets the values of all dice to null and unlocks all dice.
     */
    resetDice(){
        console.log("Resetting all dice and lock states.")
        this.activeHand = new Array(null, null, null, null, null);
        this.lockRoster = new Array(0,0,0,0,0);
    }

    /**
     * Decreases the value of rollsLeft by 1, provided the state of the game logically allows for this to occur.
     */
    decrementRoll(){
        if (this.rollsLeft > 0){
            this.rollsLeft -= 1;
            console.log("You have " + this.rollsLeft + " re-rolls left")
        }
        else{
            console.log("No re-rolls left. Make score choice and end turn.")
            // Could automatically end a round with this, but prefer to keep that in the player's control. They may wish to stare at the dice or something before ending their turn.
        }
    }

    /**
     * Resets the number of rolls available to the player to the maximum allowable amount established by the game session.
     */
    resetRolls(){
        this.rollsLeft = this.maxRolls;
    }


    
    /**
     * Simulates a user rolling the dice, under the constraints of the game logic.
     */
    rollDice(){
        if (this.rollsLeft > 0){
            console.log("Rolling the dice.")

            // Generate new potential outcomes
            let newSet = getNewHand()

            // Check the lockRoster to see which of these values we accept or not.
            for (let i = 0; i < this.lockRoster.length; i++) {
                // If the die is unlocked, re-write the old value with the new value
                if (lockRoster[i] == 0) {
                    activeHand[i] = newSet[i];
                } else {
                    // If the die is locked, don't change the value
                    console.log("Die # " + (i + 1) + " is locked." )
                }
            }
            //Spend a roll
            decrementRolls()
        }
        else{
            //This state should be made unreachable by the interface disabling the user's ability to try and roll the dice when there are no rolls left.
            console.log("Cannot roll dice. No more rolls left.")
        }
    }
}

export default YatzyGame