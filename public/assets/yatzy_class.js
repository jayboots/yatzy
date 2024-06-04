//TODO: This will be integrated into yatzy_game, but easier to develop it here.
// This is a temporary file.

// These are for updating HTML and so do not need to be in the game class...
// const dicePrefix = "d_";
// const lockPrefix = "l_";

class YatzyGame {
    constructor(maxRolls=3, maxRounds=13, numPlayers=1) {
        // Malleable, but with defaults - we can change these if we want to test
        this.maxRolls = maxRolls;
        this.maxRounds = maxRounds;
        this.numPlayers = numPlayers;
        
        //Instantiate empty hand and no locked dice when creating a new game
        this.activeHand = new Array(null, null, null, null, null);
        this.lockedDice = new Array(0,0,0,0,0);

        // Ticker variables
        this.roundStart = 1;
        this.currentRound = roundStart;
        this.rollsLeft = maxRolls;

        // Since 2P is not being included, including this until we remove it from the code base
        this.isPlayerOne = new Boolean(true)
    }
  }
