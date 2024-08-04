var tempUserID = null;

window.onload=function(){
    getUserID();
}


async function getUserID(){
    var url = "../api/session";

    var sectionHeading = document.getElementById("username");

    try {
        let response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        let data = await response.json();
        tempUserID = data[2]["userID"];
        loadScores(tempUserID);

    } catch (error) {
        console.error(error.message);
    }
}

async function loadScores(userID){

    const url = "../api/scores/top10";
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        let data = await response.json();
        
        drawScores(data);
    } catch (error) {
        document.getElementById("msg-no-scores").display = 'block';
        console.log("No leaderboard data found!")
        console.error(error.message); //not necessarily an error.
    }
}

function drawScores(data){

    // noScores.style.display = 'block';
    // scoreArea.style.display='none';

    // Necessary to put the top score at the actual top of the table...
    data.reverse()

    var scoreRows = document.getElementById("score-body");

    var involvement = 0;

    for (const key in data) {

        console.log(data[key])

        let row = scoreRows.insertRow(0)

        let Rank = row.insertCell(0);
        Rank.innerHTML = (10 - key);
        if (data[key][1] == tempUserID){
            involvement += 1;
        }
        
        let Score = row.insertCell(1);
        Score.innerHTML = data[key][2];
        let Player = row.insertCell(2);

        if (data[key][1] == tempUserID){
            Player.innerHTML = "<strong>" + data[key][4] + "</strong>  👈 <em>That's you!</em>";
        }
        else{
            if (data[key][5] == null){
                Player.innerHTML = data[key][4] + " <br>(" + data[key][3] + ")";
            }
            else{
                Player.innerHTML = data[key][4] + " " + data[key][5] + " <br>(" + data[key][3] + ")";
            }
        }

        let Region = row.insertCell(3);
        Region.innerHTML = data[key][6];

        // Weird...
        let OccuredOn = row.insertCell(4);
        tempDate = (new Date(data[key][0])).toLocaleDateString('en-CA')
        OccuredOn.innerHTML = tempDate
    }

    let analysisMsg = document.getElementById("user-analysis-msg");
    if (involvement == 0){
        analysisMsg.innerHTML = '<h4>You can do it! 💪</h4>' + '<p>Why not <a href="/>play again</a> and try for a higher score?</p>'
    }
    else if (involvement >= 8){
        analysisMsg.innerHTML = '<h4>Are you for real? 👀</h4>' + '<p> You\'re dominating the leaderboard!</p>'
    }
    else{
        analysisMsg.innerHTML = '<h4>Congratulations! ⭐</h4>' + '<p>You\'ve managed to place in <strong>' + involvement + ' out of 10</strong> leaderboard slots! Keep it up!</p>'
    }

}
