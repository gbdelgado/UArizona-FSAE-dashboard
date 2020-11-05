const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');


const PORT = 'COM3' //COM3 for windows, /dev/something mac, /dev/tty linux

const port = new SerialPort(PORT, { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

//elements
const tach = document.getElementById('rpm');
const speedo = document.getElementById('speed');
const gear = document.getElementById('gear');
const warning = document.getElementById('warning');
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Read the port data
port.on("open", () => {
  console.log('serial port open');
});

//mapping function
const mapValue = (x, in_min, in_max, out_min, out_max) =>{
    return ((x-in_min) * (out_max - out_min) / (in_max - in_min) + out_min).toFixed(2);
}

//tachometer function
const fillTach = (rpm) => {
    //clear the current filled rectangle
    c.clearRect(0,0,  canvas.width, canvas.height);

    //pick the color
    c.fillStyle = (rpm < .75) ? '#4DD502' : '#990409';
    
    //draw the rectangle
    c.fillRect(0,0, canvas.width, rpm * canvas.height);
}

parser.on('data', (msg)=>{

    //msg object will read the most recent line from the serial port
    //TODO: create JSON object with CAN ID's and messages and update the object
    //      values below
    console.log(msg);
    return;


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