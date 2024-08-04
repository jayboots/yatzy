// var userID = 2;
var userID = 25;

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

async function getUserID(){
    
}

async function loadUserInfo(userID){
    const url = "../api/users/" + userID;
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        let data = await response.json();
        renderProfile(data)

    } catch (error) {
        console.error(error.message);
    }
}

async function loadProfileScores(userID){

    var noScores = document.getElementById("msg-no-scores");
    var scoreTable = document.getElementById("score-table")

    const url = "../api/scores/" + userID;
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        let data = await response.json();

        console.log("Has scores!")
        drawMyScores(data);
        noScores.style.display='none';
        scoreTable.style.display = 'block';

    } catch (error) {
        // No scores!

        console.log("No score data found!")
        noScores.style.display = 'block';
        scoreTable.style.display='none';

        console.error(error.message);
    }
}

function renderProfile(data){
    var blurb
    if (data['username'].slice(-1) == "s"){
        blurb = "' profile page"
    }
    else {
        blurb = "'s profile page"
    }
    username.innerText = data['username'] + blurb;

    fname.innerHTML = "<strong>First Name:</strong> " + data['first_name'];

    if (data['last_name'] == null){
        lname.innerHTML = "<strong>Last Name:</strong> <em>None provided.</em>";
    }
    else{
        lname.innerHTML = "<strong>Last Name:</strong> " + data['last_name'];
    }

    if (data['region_name'] == null){
        rname.innerHTML = "<strong>Region:</strong> <em>None selected.</em>";
    }
    else{
        rname.innerHTML = "<strong>Region:</strong> " + data['region_name'];
    }
}

function drawMyScores(data){

    var scoreRows = document.getElementById("score-body");

    for (const key in data) {
        let row = scoreRows.insertRow(0)

        let date = row.insertCell(0);
        date.innerHTML = (new Date(data[key][2])).toLocaleDateString('en-CA')

        let score = row.insertCell(1);
        score.innerHTML = data[key][0];
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