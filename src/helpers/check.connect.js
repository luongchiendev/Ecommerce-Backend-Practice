const mongoose = require("mongoose");
const os = require('os');
const process = require("process");
const seconds = 5000;
//count connect
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections:: ${numConnection}`);
}

//check overload
const checkoverload = ()=>{
    setInterval( ()=>{
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        const maxConnections = numCores * 5;

        console.log(`Active connections: ${numConnection}`)
        console.log(`Memory usage:: ${memoryUsage / 1024 / 1024 } MB`)

        if (numConnection > maxConnections){
            console.log(`Connection overload detected!`);
        }
    }, seconds)// Monitor memory every 5 seconds
}

module.exports = {
    countConnect,
    checkoverload
}