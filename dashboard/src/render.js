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

/**
 * 
 * @param {*} x 
 * @param {*} in_min 
 * @param {*} in_max 
 * @param {*} out_min 
 * @param {*} out_max 
 */
const mapValue = (x, in_min, in_max, out_min, out_max) =>{
    return ((x-in_min) * (out_max - out_min) / (in_max - in_min) + out_min).toFixed(2);
}


module.exports = {
    /**
     * @param rpm {int} -- an int representing the current rpm
     */
    fillTach: (rpm)=>{
        //first fill the number tach
        tach.innerHTML = rpm;

        //get the mapped value
        let percent = mapValue(rpm, 0, 2000, 0, 1);

        //clear the current filled rectangle
        c.clearRect(0,0,  canvas.width, canvas.height);
    
        //pick the color
        c.fillStyle = (percent < .75) ? '#4DD502' : '#990409';
    
        //draw the rectangle
        c.fillRect(0,0, canvas.width, percent * canvas.height);
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
