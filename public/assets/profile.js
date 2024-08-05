var formVisible = false;
var selectedRegionName = null;
var tempData = null;
var tempRegion = null
var tempUserID = null;
var canSubmit = true;

window.onload=function(){

    const editBtn = document.getElementById("btn-edit");
    const saveBtn = document.getElementById("btn-save");
    const cancelBtn = document.getElementById("btn-cancel");

    editBtn.addEventListener("click", editForm, true);
    saveBtn.addEventListener("click", saveDetails, true);
    cancelBtn.addEventListener("click", cancelChanges, true);

    // Default hide some elements on load
    document.getElementById("scores-container").style.display='none';


    const regionSelector = document.getElementById("regionSelector");
    // regionSelector.addEventListener("click", regionSelect, true);
    // regionSelector.addEventListener("click", regionSelect, true);

    // Load the profile data when the page starts...
    getUserID();
    toggleFormElements();
}

function editForm(){
    // console.log("Clicked Edit")
    formVisible = true;
    toggleFormElements();
}

async function saveDetails(){
    // console.log("Clicked Save")

    // var form = document.getElementById("profile");
    formVisible = false;

    let actualRegion = null;
    let actualLastName = null;

    if (document.querySelector("#regionSelector").value != -1) {
        actualRegion = document.querySelector("#regionSelector").value
    }

    if (document.querySelector("#editLastName").value.trim() != "") {
        actualLastName = document.querySelector("#editLastName").value.trim()
    }

    newValues = JSON.stringify({
        "first_name": document.querySelector("#editFirstName").value,
        "last_name": actualLastName,
        "region_id": actualRegion
    })

    var url = "../api/users/" + tempUserID;
    
    console.log(url);
    // For validation
    if (canSubmit){
    
        let url = "../api/users/" + tempUserID;

        try {
            let response = await fetch(url, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                },
                body: newValues,
                });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            let data = await response.json();
            console.log("Updated user info!")
            console.log(data);
            loadUserInfo(data["entry"]["user_id"]);
            // loadProfileScores(userID)
            getRegions();
    
        } catch (error) {
            console.error(error.message);
        }
    }
}

function cancelChanges(){
    // console.log("Clicked Cancel")
    formVisible = false;
    toggleFormElements();
    if (tempData != null){
        renderProfile(tempData);
    }
    document.getElementById("regionSelector");
    regionSelector.value = tempRegion;

}

function toggleFormElements(){
    // console.log("Is the form visible? " + formVisible)

    let editBtn = document.getElementById("btn-edit");
    let saveBtn = document.getElementById("btn-save");
    let cancelBtn = document.getElementById("btn-cancel");

    let fields = document.getElementById("fields");

    // If in edit mode
    if (formVisible){
        editBtn.disabled = true;
        saveBtn.disabled = false;
        cancelBtn.disabled = false;

        
        fields.disabled = false;

        editBtn.style.display='none';
        saveBtn.style.display='inline-block';
        cancelBtn.style.display='inline-block';
    }
    else{
        editBtn.disabled = false;
        saveBtn.disabled = true;
        cancelBtn.disabled = true;

        fields.disabled = true;

        editBtn.style.display='inline-block';
        saveBtn.style.display='none';
        cancelBtn.style.display='none';
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
    
        const data = await response.json();

        var regionSelector = document.getElementById("regionSelector");
        regionSelector.innerHTML = "";

        for (let key in data) {

            let option = document.createElement('option');

            option.value = data[key][0];
            option.innerHTML = data[key][1];

            if (option.innerHTML == selectedRegionName){
                option.selected="selected";
                tempRegion = data[key][0];
            }
            regionSelector.appendChild(option);
        }
        // Add element for profiles without region info
        let noRegion = document.createElement('option');

        noRegion.value = -1;
        noRegion.innerHTML = "----None----";

        if (selectedRegionName == null){
            tempRegion = -1;
            noRegion.selected="selected";
        }

        regionSelector.appendChild(noRegion);

        // console.log(reverseLookUp)

    } catch (error) {
        console.error(error.message);
    }
}

// PROFILE LOADING LOGIC

async function getUserID(){
    var url = "../api/session";

    var sectionHeading = document.getElementById("username");

    try {
        let response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        let data = await response.json();
        // console.log(data);
        let userID = data[2]["userID"];
        tempUserID = userID;
        // console.log(userID)
        loadUserInfo(userID);
        loadProfileScores(userID)
        getRegions();

    } catch (error) {
        console.error(error.message);
    }
}

async function loadUserInfo(userID){
    const url = "../api/users/" + userID;
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        let data = await response.json();

        tempData = data;
        // console.log("Storing temporarily-retrieved profile info")
        // console.log(tempData)

        renderProfile(data)

    } catch (error) {
        console.error(error.message);
    }
}

async function loadProfileScores(userID){

    var noScores = document.getElementById("msg-no-scores");
    var scoreArea = document.getElementById("scores-container")
    var scoresHeader = document.getElementById("scores-header");

    const url = "../api/scores/" + userID;
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        let data = await response.json();

        // console.log("Has scores!")
        drawMyScores(data);
        scoresHeader.innerText = "My Scores: (" + data.length + " Games)";
        noScores.style.display='none';
        scoreArea.style.display = 'block';

    } catch (error) {
        // console.log("No score data found!")
        noScores.style.display = 'block';
        scoreArea.style.display='none';
        // console.error(error.message); //not necessarily an error.
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

    editFirstName.value = data['first_name'];
    editLastName.value = data['last_name']
    selectedRegionName = data['region_name'];
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
