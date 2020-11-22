const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const {sendWarning} = require('./render');

const PORT = 'COM3' //COM3 for windows, /dev/something mac, /dev/tty linux

const port = new SerialPort(PORT, { baudRate: 9600 }, (e)=>{
    //error callback
    if(e instanceof Error){
        sendWarning(e.message);
    }
});
const parser = port.pipe(new Readline({ delimiter: '\n' }));

// Read the port data
port.on("open", () => {
    console.log('serial port open');
    //cancel any warning if there was any
    cancelWarning()  
});  


//mapping function
const mapValue = (x, in_min, in_max, out_min, out_max) =>{
    return ((x-in_min) * (out_max - out_min) / (in_max - in_min) + out_min).toFixed(2);
}


parser.on('data', (msg)=>{

    //msg object will read the most recent line from the serial port
    //TODO: create JSON object with CAN ID's and messages and update the object
    //      values below
    console.log(typeof msg);

    let num = msg.split(/(\s+)/)[16];

    tach.innerHTML = num;

    return;


    //grab the data from the packet
    const rpm = msg.m_carTelemetryData[0].m_engineRPM;
    const currGear = msg.m_carTelemetryData[0].m_gear;
    const speed = msg.m_carTelemetryData[0].m_speed;
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