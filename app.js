const express = require("express");
const hbs = require("hbs")
const session = require("express-session");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
const mongodb = require("mongodb")

var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.MONGRODB_URI || "mongodb://localhost:27017/lapanmp3"

const app = express();
const http = require("http");
const port = process.env.PORT || 3000

MongoClient.connect(mongoUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
    }
    , function(err, db){
    if (err){
        console.log("Cannot connect")
    }
    else{
        
        console.log()
        console.log("Connected")
    }
})
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/lapanmp3", {
    useNewUrlParser: true
});

app.set("view engine", "hbs")
app.use(express.static(__dirname + "/public"))

app.use(cookieparser())

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "secret",
    name: "mp2-cookie",
    cookie: {
        maxAge: 1000*60*60*24*365*5
    }
}))

app.use(require("./controllers"))

app.listen(port, function(){
    console.log("MP3 server is now connected. Welcome to Student Club Joiner.")
})