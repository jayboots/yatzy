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
            welcomeMsg.innerHTML = "<h1>Administrator Panel</h1> <hr />" + "<h3>Welcome to the User Management Utility Page 🔧</h3>"
            loadUsers();
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

async function loadUsers(){
    const url = "../api/users";
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        let data = await response.json();
        drawUsers(data);
    } catch (error) {

        console.log("No score logs found")
        console.error(error.message); //not necessarily an error.
    }
}

function drawUsers(data){
    console.log(data)

    // Clear out any old data...
    var scoreRows = document.getElementById("user-body")
    scoreRows.innerHTML = "";

    // No reversal because older accounts are less likely to be suspect, I presume.
    // data.reverse()

    for (const key in data) {

        console.log(data[key])

        let row = scoreRows.insertRow(0)

        let accountID = row.insertCell(0);
        accountID.innerHTML = data[key][0];

        let Username = row.insertCell(1);
        if (data[key][5] == 1){
            Username.innerHTML = "⚡" + data[key][1] + "⚡"
        }
        else{
            Username.innerHTML = data[key][1]
        }
        
        let fullName = row.insertCell(2);
        if (data[key][3] == null){
            fullName.innerHTML = data[key][2]
        }
        else{
            fullName.innerHTML = data[key][2] + " " + data[key][3]
        }

        let Region = row.insertCell(3);
        Region.innerHTML = data[key][4];

        let Action = row.insertCell(4);

        if (data[key][5] != 1){
            let btn = document.createElement("button")
            btn.id = data[key][0]
            btn.innerHTML = "Delete";
            btn.addEventListener("click", deleteMe, true)
            Action.appendChild(btn)
        }
        else{
            // Action.innerHTML = "Mod Privilege";
        }

    }
}

async function deleteMe(){
    console.log(this.id);

    // window.confirm("Are you sure?")

    let url = "../api/users/" + this.id;

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
        loadUsers();

    } catch (error) {
        console.error(error.message);
    }
    
}