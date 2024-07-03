
export class ScoreCard {
    
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
        this.bonusThreshold = 63;
    }

    calculateBonus(){
        let firstSectionTotal = this.records["ones"]
        + this.records["twos"]
        + this.records["threes"]
        + this.records["fours"]
        + this.records["fives"]
        + this.records["sixes"];     
        if( firstSectionTotal >= this.bonusThreshold && this.bonus == 0){
            this.bonus = 50;
        }
        else{
            console.log("First six sum score: " + firstSectionTotal)
            console.log("No bonus...")
        }
        return this.bonus;
    }
}