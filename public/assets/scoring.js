//index 0-5 => upper section, index 6-14 => lower section
var combinations = new Array("ones", "twos", "threes", "fours", "fives", "sixes", 
                                "one pair", "two pairs", "three of a kind", "four of a kind", "small straight", "large straight", "full house", "chance", "yatzy");

//possible scores for the round, after player rolls
var roundScoreboard = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);

//final score board after player has confirmed a score to keep; -1 => no value set
var finalScoreboard = new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);

var bonus = 0;
var totalScore = 0;

/**
 * To calculate player's score choices after they roll.
 * Re-call this function after each roll 
 * @returns an array of all possible scores with the given combination of dice
 */
function getPotentialScores(dice) {
    //refresh scoreboard 
    roundScoreboard = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);

    //sort dice for easier checking
    dice.sort();
    console.log("sorted dice: " + dice);

    var count = new Array(0,0,0,0,0,0);
    var smallStraight = true;
    var largeStraight = true;
    var pairs = new Array();

    for (var i=0; i<dice.length; i++) {
        const curIndex = dice[i]-1;
        //upper section => update sum of singles
        roundScoreboard[curIndex] += dice[i];

        //lower section  => count duplicates
        count[curIndex]++;

        //check for straights
        if (smallStraight) {
            smallStraight = dice[i] == i+1 ? true:false;
        }
        if (largeStraight) {
            largeStraight = dice[i] == i+2 ? true:false;
        }
        
        //calculate chance score 
        roundScoreboard[13] += dice[i];
    }

    //update straight scores
    if (smallStraight) {roundScoreboard[10] = 15}
    if (largeStraight) {roundScoreboard[11] = 20}

    //update other scores
    for (var i=0; i<count.length; i++) {
        const diceValue = i+1;

        //check for pairs
        if (count[i] >= 2) {
            roundScoreboard[6] = (diceValue)*2;
            pairs.push(diceValue);
        }
        //two pairs
        if (pairs.length == 2) {
            roundScoreboard[7] = pairs[0]*2 + pairs[1]*2;
        }

        //check for three of a kind
        if (count[i] == 3) {
            if (pairs.length > 1) { //there is a full house
                roundScoreboard[12] = (pairs[0] != diceValue ? pairs[0]:pairs[1])*2 + diceValue*3;
            }
            roundScoreboard[8] = diceValue*3;
        }

        //check for four of a kind
        else if (count[i] == 4) {
            roundScoreboard[9] = diceValue*4;
        }

        //check for five of a kind (yatzy)
        else if (count[i] == 5) {
            roundScoreboard[14] = diceValue*5;
        }
    }
    return roundScoreboard;
}

/**
 * Given player's choice by array index (starting at 0), update their total score.
 * Should only be called after getPotentialScores(dice) is called to ensure the final score will be correct
 * @returns updated scoreboard along with the total score in an array: {scoreboard array, total score}
 */
function updateScore(choice) {
    //player's score choice is valid => update final scoreboard and add value to total score
    if (finalScoreboard[choice] == -1) {
        finalScoreboard[choice] = roundScoreboard[choice];

        //check for bonus
        var tempScore = 0;
        for (var i=0; i<6; i++) {
            tempScore += finalScoreboard[i] != -1 ? finalScoreboard[i]:0;
        }
        if (bonus==0 && tempScore >= 63) {
            bonus = 50;
        }

        //update total score
        totalScore += (roundScoreboard[choice] + bonus);

    } else {
        console.log("Already chosen a score for this box");
    }

    return [finalScoreboard, totalScore];
}

/**
 * resets all scores: potential/round, final, and total
 * used only when game ends
 */
function resetScore() {
    roundScoreboard = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    finalScoreboard = new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
    bonus = 0;
    totalScore = 0;
}

//for testing-------------------------------------------------------------------------------------------------
function showRoundScore() {
    for (var i=0; i<combinations.length; i++) {
        console.log(combinations[i] + ": " + roundScoreboard[i]);
    }
} 

function showFinalScore() {
    for (var i=0; i<combinations.length; i++) {
        console.log(combinations[i] + ": " + finalScoreboard[i]);
    }
    console.log("total score: " + totalScore)
}

// //test run
// getPotentialScores([1,2,3,4,5]);
// showRoundScore();
// updateScore(10);
// console.log("");

// getPotentialScores([1,5,5,5,5]);
// showRoundScore();
// updateScore(9);
// console.log("");

// showFinalScore();
// resetScore();