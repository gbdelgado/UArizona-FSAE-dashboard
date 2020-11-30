const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const {sendWarning, cancelWarning, fillTach, fillSpeedo, fillGear} = require('./render');

//defining base constants
const PORT = "COM3";
const BAUDRATE = 9600;

//inital connect to can
const port = new SerialPort(PORT, {autoOpen: false, baudRate: BAUDRATE });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

//Base Functions
const connectToCan = ()=>{
    port.open((e)=>{
        //if there is no error
        if(!e){
            return;
        }
        console.log(e.message);
        console.error("Disconnected from CAN, trying again in 1s");
        sendWarning("Can't connect to CAN");
        setTimeout(()=>{connectToCan()}, 2000);  
    })
}


// Read the port data
port.on("open", () => {
    console.log('serial port open');
    //cancel any warning if there was any
    cancelWarning()
    port.resume();  
});  

port.on('close', (err)=>{
    sendWarning("Can't connect to CAN BUS, trying again");
    connectToCan();
});



parser.on('data', (msg)=>{
    console.log(msg);
    let telem = msg.split('\t');
    const rpm = parseInt(telem[0]);
    const speed = parseInt(telem[1]);
    const gear = telem[2]; //keep gear as a string
    fillTach(rpm);
    fillSpeedo(speed);
    fillGear(gear);
})


//open the port manually
connectToCan();

