#!/usr/bin/node
/* First Video
function say_hello(name) {
    console.log(`Hello ${name}`);
}

//const logger = require("./logger");

//say_hello("Johang");
//console.log(window);
//var message;
//console.log(global.message);
//console.log(module);
//console.log(logger);
//logger.log("message");

//const path = require("path");

//const path_obj = path.parse(__filename);

//console.log(path_obj);

//const os = require("os");

//const total_mem = os.totalmem();
//const free_mem = os.freemem();

//console.log(`Total Memory: ${total_mem}`);
//console.log(`Free Memory: ${free_mem}`);

//const fs = require("fs");

//const files = fs.readdirSync("./");

//console.log(files)
/*
fs.readdir("notadirectory", function(err, files){
    if (err) console.log("Error", err);
    else console.log("Result", files);
});

//const EventEmitter = require("events");
//const { emitWarning } = require("process");




//emitter.emit("message_logged", {id: 1, url: "tetr.io"});


//const Logger = require("./logger");

//const logger = new Logger();

/*
logger.on("message_logged", (args) => {
    console.log("Listener Called!!!", args)
});
logger.log("message")

/*
const http = require("http");

const server = http.createServer((req, res) =>
{
    if (req.url === "/") {
        res.write("Hewo");
        res.end();
    }

    if (req.url === "/api/courses") {
        res.write(JSON.stringify([1, 2, 3]));
        res.end();
    }
});



server.listen(3000);

console.log("Listening on port 3000...");
*/

