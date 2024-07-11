window.onload=function(){
  const endRoundBtn = document.getElementById("endRoundBtn");

  endRoundBtn.addEventListener('click', function(event) {
    console.log("clicked");
    let name = window.prompt('Enter your name');
    const score = document.getElementById("total-score").innerText;
    submitScore(name, score);
  }); 
}

//gets leaderboard scores and names 
async function submitScore(name, score) {
  //request setup
  const url = '/score';
  const jsonData = { name, score };
  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json' 
      },
      body: JSON.stringify(jsonData) 
  };

  //get data from api and update html page
  fetch(url, options).then(response => {
      if (!response.ok) {
          throw new Error("failed with: "+ response.status);
      }
      return response.json();

  }).then(data => {
      let scoreData = JSON.parse(JSON.stringify(data));
      let scoreboard = document.getElementById("scores");
      //delete current scoreboard
      scoreboard.innerHTML = '';

      //update scoreboard with new scores
      console.log(scoreData);
      scoreData.map((score, index) => {
          let row = scoreboard.insertRow(-1);
          let rank = row.insertCell(0);
          let name = row.insertCell(1);
          let result = row.insertCell(2);
          rank.innerHTML = index+1;
          name.innerHTML = score.name;
          result.innerHTML = score.score;
      })

  }).catch(error => {
      console.error("fetch error: ", error);
  });
}