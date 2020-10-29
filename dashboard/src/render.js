const { F1TelemetryClient, constants } = require('f1-telemetry-client');
const { PACKETS } = constants;

const client = new F1TelemetryClient({ port: 20777, bigintEnabled: true });

//elements
const tach = document.getElementById('rpm');
const speedo = document.getElementById('speed');
const gear = document.getElementById('gear');
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');


//mapping function
const mapValue = (x, in_min, in_max, out_min, out_max) =>{
    return ((x-in_min) * (out_max - out_min) / (in_max - in_min) + out_min).toFixed(2);
}

//tachometer function
const fillTach = (rpm) => {
    //clear the current filled rectangle
    c.clearRect(0,0,  canvas.width, canvas.height);
    //pick the color
    if(rpm < .25){
        c.fillStyle = '#DEEDCF';
    } else if(rpm > .25 && rpm < .50){
        c.fillStyle = '#56B870';
    } else if(rpm > .50 && rpm < .75){
        c.fillStyle= '#1D9A6C';
    } else {
        c.fillStyle = '#0E4D64';
    }
    
    //draw the rectangle
    c.fillRect(0,0, canvas.width, rpm * canvas.height);
}

client.on(PACKETS.carTelemetry, (msg)=>{
    //grab the data from the packet
    const currGear = msg.m_carTelemetryData[0].m_gear;
    const speed = msg.m_carTelemetryData[0].m_speed;
    const rpm = msg.m_carTelemetryData[0].m_engineRPM;
    const mappedRpm = mapValue(rpm, 0, 13500, 0, 1);

    // 0 = Netrual and -1 is Reverse
    if(currGear == 0){
        gear.innerHTML = "N";
    } else if (currGear == -1){
        gear.innerHTML = "R"
    } else {
        gear.innerHTML = currGear;
    }

    //fill the speed and tach
    speedo.innerHTML = speed;
    tach.innerHTML = rpm;

    //fill the revbar
    fillTach(mappedRpm);
})

client.start();