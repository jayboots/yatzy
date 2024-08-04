var userID = 2;

window.onload=function(){
    const username = document.getElementById("username");
    const fname = document.getElementById("fname");
    const lname = document.getElementById("lname");
    const rname = document.getElementById("rname");

    // Load user scores into this table, or display a message if there is no history... (i.e. a fresh account or all scores deleted)

    // Load the profile data when the page starts...
    loadUserInfo(userID);
    loadProfileScores(userID)
    getRegions();
}

async function loadUserInfo(userID){
    const url = "../api/users/" + userID;
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        let data = await response.json();
        // console.log(data);
        username.innerText = "Username: " + data['username'];
        fname.innerText = "First Name: " + data['first_name'];
        lname.innerText = "Last Name: " + data['last_name'];
        rname.innerText = "Region: " + data['region_name'];

    } catch (error) {
        console.error(error.message);
    }
}

async function loadProfileScores(userID){
    const url = "../api/scores/" + userID;
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        let data = await response.json();
        drawMyScores(data);
    } catch (error) {
        console.error(error.message);
    }
}

// Function to resolve the region IDs to names
async function getRegions(){
    var url = "../api/regions";
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
}

function drawMyScores(data){

    var noScores = document.getElementById("msg-no-scores");
    var scoreTable = document.getElementById("score-table")
    var scoreRows = document.getElementById("score-body");

    console.log(data.length);
    // If we have scores
    if (data.length > 0){
        console.log("Has scores!")
        //Set some visibility things
        noScores.style.display='none';
        scoreTable.style.display = 'block';

        for (const key in data) {
            let row = scoreRows.insertRow(0)
    
            let date = row.insertCell(0);
            date.innerHTML = (new Date(data[key][2])).toLocaleDateString('en-CA')
    
            let score = row.insertCell(1);
            score.innerHTML = data[key][0];
        }
    }
    else {
        console.log("No score data found!")
        noScores.style.display = 'block';
        scoreTable.style.display='none';
    }
}