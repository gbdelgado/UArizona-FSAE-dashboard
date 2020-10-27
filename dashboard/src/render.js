const { F1TelemetryClient, constants } = require('f1-telemetry-client');
const { PACKETS } = constants;

const client = new F1TelemetryClient({ port: 20777, bigintEnabled: true });

//elements
const tach = document.getElementById('rpm');
const speedo = document.getElementById('speed');
const gear = document.getElementById('gear');


client.on(PACKETS.carTelemetry, (msg)=>{
    // 0 = Netrual and -1 is Reverse
    if(msg.m_carTelemetryData[0].m_gear == 0){
        gear.innerHTML = "N";
    } else if (msg.m_carTelemetryData[0].m_gear == -1){
        gear.innerHTML = "R"
    } else {
        gear.innerHTML = msg.m_carTelemetryData[0].m_gear;
    }

    speedo.innerHTML = msg.m_carTelemetryData[0].m_speed;
    tach.innerHTML = msg.m_carTelemetryData[0].m_engineRPM;
})

client.start();