#!/usr/bin/node


const EventEmitter = require("events");

//console.log(__filename);
//console.log(__dirname);

class Logger extends EventEmitter {
    log(message) {
        console.log(message);
        this.emit("message_logged", {id: 1, url: "tetr.io"});
    }
}

let url = "http://mylogger.io/log"



module.exports = Logger;
