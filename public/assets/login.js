canSubmit = true;

window.onload=function(){
    console.log("Hello World")

    const submitBtn = document.getElementById("btn-submit");
    const cancelBtn = document.getElementById("btn-cancel");

    submitBtn.addEventListener("click", login, true);
    cancelBtn.addEventListener("click", cancelRegistration, true);
}

function cancelRegistration(){
    // Reroute to the main page, and just ensure no session variables have been set.
    window.location.replace("/");
}

function login(){
    console.log("Logging in lol")
}