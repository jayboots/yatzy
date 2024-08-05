canSubmit = true;

window.onload=function(){
    console.log("Hello World")

    getRegions();

    const submitBtn = document.getElementById("btn-submit");
    const cancelBtn = document.getElementById("btn-cancel");

    submitBtn.addEventListener("click", register, true);
    cancelBtn.addEventListener("click", cancelRegistration, true);
}

var selectedRegionName = null;
var tempRegion = null

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

async function register(){

    console.log("Clicked me")
    var url = "../api/users/signup"

    if (canSubmit){

        let actualRegion = null;
        let actualLastName = null;
    
        if (document.querySelector("#regionSelector").value != -1) {
            actualRegion = document.querySelector("#regionSelector").value
        }
    
        if (document.querySelector("#lastName").value.trim() != "") {
            actualLastName = document.querySelector("#lastName").value.trim()
        }

        let newValues = JSON.stringify({
            "username" :  document.querySelector("#userName").value,
            "first_name": document.querySelector("#firstName").value,
            "last_name": actualLastName,
            "password" :  document.querySelector("#psw").value,
            "region_id": actualRegion
        })

        console.log(newValues);

        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: newValues,
                });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            let data = await response.json();
            console.log("Created a user account!")
            console.log(data);
            // Simulate an HTTP redirect:
            window.location.replace("/");

        } catch (error) {
            console.error(error.message);
        }
    }
}

function cancelRegistration(){
    // Reroute to the main page, and just ensure no session variables have been set.
    window.location.replace("/");
}