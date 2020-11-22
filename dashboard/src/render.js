/**
 * Handles all DOM changes and renders, answers calls from process.js
 */

//elements
const body = document.getElementById("body");
const app = document.getElementById("App");
const warning = document.getElementById("warning");


const tach = document.getElementById('rpm');
const speedo = document.getElementById('speed');
const gear = document.getElementById('gear');
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');


module.exports = {
    /**
     * @param rpm {float} -- a float representing the percent of how much the
     *                       rev bar should be filled
     */
    fillTach: (rpm)=>{
        //clear the current filled rectangle
        c.clearRect(0,0,  canvas.width, canvas.height);
    
        //pick the color
        c.fillStyle = (rpm < .75) ? '#4DD502' : '#990409';
    
        //draw the rectangle
        c.fillRect(0,0, canvas.width, rpm * canvas.height);
    },

    /**
     * Blocks the application to display a warning message
     * @param msg {String} -- a string representing the message
     */
    sendWarning: (msg)=>{
        //change the background to white
        body.style.backgroundColor= "white";
        //disable the app
        app.style.display = "none";
        //enable the warning message
        warning.style.display = "block";
        //change the message
        document.getElementById("warningMessage").innerHTML = msg;
    },

    cancelWarning: ()=>{
        //change the background back to black
        body.style.backgroundColor = "black";
        //disable the warning
        warning.style.display = "none";
        //enable the app
        app.style.display = "block";
    }

    
}
