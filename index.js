require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const http = require("http");
const config = require("./config/config");

const app = express();
const server = http.createServer(app);


const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: false,
});
const jsonEncoded = express.json({
    limit: "50mb",
});

app.use(cors());
app.use(morgan("dev"));
app.use(urlEncoded);
app.use(jsonEncoded);


// api routes loader
fs.readdirSync(path.join(__dirname, "/routes")).filter(fileName => fileName.endsWith("_route.js") && !fileName.startsWith("old_")).forEach((routeFile) =>{
    try {
        const router = require(`./routes/${routeFile}`);
        app.use("/api", router);
        console.log(('[Route] ') + (`Loaded : ${routeFile} : ✅`));
    }
    catch(e){
        console.log(('[Routes] ') + (`Fail to Load : ${routeFile} : ❌ : `) + (e));
    }
    
});


server.listen(config.port, () => {
    console.log(`> RestAPI Service listening on port : ${config.port} : http://127.0.0.1:${config.port}`);
});


// Error Handler

// process.on('unhandledRejection', (reason, promise) => {
//     console.error('[antiCrash] :: [unhandledRejection]');
//     console.log(promise, reason);
// });
// process.on("uncaughtException", (err, origin) => {
//     console.error('[antiCrash] :: [uncaughtException]');
//     console.log(err, origin);
// });
// process.on('uncaughtExceptionMonitor', (err, origin) => {
//     console.error('[antiCrash] :: [uncaughtExceptionMonitor]');
//     console.log(err, origin);
// });