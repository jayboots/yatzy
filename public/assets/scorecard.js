/**
 * Simulates a score card. Could in theory be a component of the YatzyGame class, but conceptually the game is a separate entity from a method of tracking scores (one game could have many score cards) and the YatzyGame class isn't meant to know about the "rules" of the game as per the assignment, so for code organization, we have created a separate class in a separate file.
 *
 * @class ScoreCard
 * @typedef {ScoreCard}
 */
export class ScoreCard {
    
    /**
     * Creates an instance of a ScoreCard.
     */
    constructor() {
        this.records = {
            "ones" : null, 
            "twos" : null, 
            "threes" : null,
            "fours" : null, 
            "fives" : null, 
            "sixes" : null, 
            "onePair" : null, 
            "twoPairs" : null, 
            "threeKind" : null, 
            "fourKind" : null, 
            "smallStraight" : null, 
            "largeStraight" : null, 
            "fullHouse" : null, 
            "chance" : null, 
            "yatzy" : null
        }
        // this.baseScore = 0; //redundant with game.score?
        this.bonus = 0;
    }

    calculateBonus(){
        let firstSectionTotal = this.records["ones"]
        + this.records["twos"]
        + this.records["threes"]
        + this.records["fours"]
        + this.records["fives"]
        + this.records["sixes"];     
        if( firstSectionTotal >= 63 && this.bonus == 0){
            this.bonus = 50;
        }
        else{
            console.log("First six sum score: " + firstSectionTotal)
            console.log("No bonus...")
        }
        return this.bonus;
    }
}