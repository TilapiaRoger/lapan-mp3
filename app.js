const express = require("express");
const hbs = require("hbs")
const session = require("express-session");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");

const router = express.Router();
const app = express();

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

app.listen(3000, function(){
    console.log("MP3 server is now connected. Welcome to Student Club Joiner")
})