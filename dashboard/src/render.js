/**
 * Handles all DOM changes and renders, answers calls from process.js
 */

//elements
const body = document.getElementById("body");
const app = document.getElementById("App");
const warning = document.getElementById("warning");


const tach = document.getElementById('rpm');
const speedo = document.getElementById('speed');
const gearElem = document.getElementById('gear');
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
        let percent = mapValue(rpm, 0, 13000, 0, 1);

        //clear the current filled rectangle
        c.clearRect(0,0,  canvas.width, canvas.height);
    
        //pick the color for revbar
        c.fillStyle = (percent < .85) ? '#4DD502' : '#990409';
        //also for the gear
        gearElem.style.color = c.fillStyle;
    
        //draw the rectangle
        c.fillRect(0,0, canvas.width, percent * canvas.height);
    },

    fillSpeedo: (speed)=>{
        speedo.innerHTML = speed;
    },

    /**
     * Takes in a string representing a gear and will decide if the current
     * gear is in neutral or reverse and then fill the dom element with the
     * correct gear
     * @param gear {String} -- a string representing the current gear
     */
    fillGear: (gear)=>{
        //check for Neutral and Reverse
        switch(gear){
            case "-1":
                gear = "R";
                break;
            case "0":
                gear = "N";
                break;
        }
        gearElem.innerHTML = gear;
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
