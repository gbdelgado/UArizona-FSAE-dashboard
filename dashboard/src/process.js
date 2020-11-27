const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const {sendWarning, cancelWarning, fillTach} = require('./render');

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

    //msg object will read the most recent line from the serial port
    //TODO: create JSON object with CAN ID's and messages and update the object
    //      values below
    fillTach(parseInt(msg));

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


//open the port manually
connectToCan();

