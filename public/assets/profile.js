var userID = 2;

window.onload=function(){
    // Load the profile data when the page starts...
    loadUserInfo(userID);
    loadProfileScores(userID)
    getRegions();

    const username = document.getElementById("username");
    const fname = document.getElementById("fname");
    const lname = document.getElementById("lname");
    const rname = document.getElementById("rname");
}

function loadUserInfo(userID){
    console.log(userID)
}

function loadProfileScores(userID){
    console.log(userID)
}

// Function to resolve the region IDs to names
async function getRegions(){
    fetch('../api/regions')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Data received:', data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}