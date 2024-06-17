/**
 * Simulates a score card
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

    //Could use this to iterate through the key
    // calculateBaseScore(){
    //     console.log("Hello")
    //     for (const [key, value] of Object.entries(this.records)) {
    //         console.log(`${key} ${value}`);
    //       }
    // }
}