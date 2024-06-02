// Choose which die face to display by selecting a digit from 1-6

// Default set the "roll" hand to impossible values when no roll
// This could hold the values of the hand but we need a way to keep an expanding array of turns : outcomes to display in a table
let results = [0,0,0,0,0]

document.getElementById("rollbtn").onclick = function(){
    // console.log("Hello World")
    let d1 = Math.floor(Math.random() * 6) + 1;
    let d2 = Math.floor(Math.random() * 6) + 1;
    let d3 = Math.floor(Math.random() * 6) + 1;
    let d4 = Math.floor(Math.random() * 6) + 1;
    let d5 = Math.floor(Math.random() * 6) + 1;

    //The values, can do something with them
    console.log([d1, d2, d3, d4, d5])

    document.getElementById("d1").src="assets/d"+ d1+".svg"
    document.getElementById("d2").src="assets/d"+ d2+".svg"
    document.getElementById("d3").src="assets/d"+ d3+".svg"
    document.getElementById("d4").src="assets/d"+ d4+".svg"
    document.getElementById("d5").src="assets/d"+ d5+".svg"
}
