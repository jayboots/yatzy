canSubmit = true;

window.onload=function(){
    const submitBtn = document.getElementById("btn-submit");
    const cancelBtn = document.getElementById("btn-cancel");

    submitBtn.addEventListener("click", login, true);
    cancelBtn.addEventListener("click", cancelRegistration, true);
}

function cancelRegistration(){
    // Reroute to the main page, and just ensure no session variables have been set.
    window.location.replace("/");
}

async function login(){
    // console.log("Clicked me")
    var url = "./api/users/login"

    if (canSubmit){

        let credentials = JSON.stringify({
            "username" :  document.querySelector("#userName").value,
            "password" :  document.querySelector("#psw").value
        })

        console.log(credentials);

        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: credentials,
                });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            let data = await response.json();
            // console.log("Logged in")
            // console.log(data);
            // console.log(data["entry"][0]["type_id"])
            // Simulate an HTTP redirect:
            window.location.replace("/");
        } catch (error) {
            console.error(error.message);

            // clear form if error
        }
    }
}