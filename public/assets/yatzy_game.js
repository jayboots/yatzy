import {
    rollDice,
    getRollValue
} from "./dice.js";

window.onload=function(){
    var rollbtn = document.getElementById("rollbtn");
    rollbtn.addEventListener("click", rollDice, true);
}