var tempUserID = null;
var threshold = 1575;

window.onload=function(){
    getUserID();
}

async function getUserID(){
    var url = "../api/session";

    var welcomeMsg = document.getElementById("welcome-msg");

    try {
        let response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        let data = await response.json();

        if (data[0]["loggedIn"] && data[1]["isAdmin"]){
            console.log("Session shows admin priviledges and logged in. Proceed.")
            let secure = document.getElementById("admin-restricted")
            secure.style.display = "block"
            welcomeMsg.innerHTML = "<h2>Administrator Panel</h2>" + "<h3>Welcome to the Score Management Utility Page</h3>"
            loadScores();
        }
        else{
            // How are you accessing this page??
            let secure = document.getElementById("admin-restricted")
            secure.style.display = "none"
            welcomeMsg.innerHTML = "<h1>⛔⛔⛔ Stop! No Virtual Trespassing! ⛔⛔⛔</h1>" + "<p>We're not sure how you got here, but you need to leave. You don't have permission to be here.</p>"
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function loadScores(){
    const url = "../api/scores";
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        let data = await response.json();
        drawScores(data);
    } catch (error) {

        console.log("No score logs found")
        console.error(error.message); //not necessarily an error.
    }
}

function drawScores(data){
    console.log(data)

    // Clear out any old data...
    var scoreRows = document.getElementById("score-body")
    scoreRows.innerHTML = "";

    // Necessary to put the top score at the actual top of the table...
    data.reverse()

    for (const key in data) {

        console.log(data[key])

        let row = scoreRows.insertRow(0)

        let RecordID = row.insertCell(0);
        RecordID.innerHTML = data[key][0];

        // Weird...
        let OccuredOn = row.insertCell(1);
        tempDate = (new Date(data[key][4])).toLocaleDateString('en-CA')
        OccuredOn.innerHTML = tempDate

        let Score = row.insertCell(2);
        if (data[key][1] > threshold){
            Score.innerHTML = "<strong>" + data[key][1] + "</strong> 🚨";
        }
        else{
            Score.innerHTML = data[key][1];
        }
        
        let Username = row.insertCell(3);
        Username.innerHTML = data[key][2]

        let UserID = row.insertCell(4);
        UserID.innerHTML = data[key][3]

        let Action = row.insertCell(5);

        let btn = document.createElement("button")
        btn.id = data[key][0]
        btn.innerHTML = "Delete";
        btn.addEventListener("click", deleteMe, true)
        Action.appendChild(btn)

    }
}

async function deleteMe(){
    console.log(this.id);

    // window.confirm("Are you sure?")

    let url = "../api/scores/" + this.id;

    try {
        let response = await fetch(url, {
            method: 'DELETE'
            });
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        let data = await response.json();
        console.log("Deleted record.")
        console.log(data);
        loadScores();

    } catch (error) {
        console.error(error.message);
    }
    
}