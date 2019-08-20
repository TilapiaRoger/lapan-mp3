const express = require("express");
const router = express.Router();
const session = require("express-session");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");

const auth = require("../middlewares/auth");

const {User} = require("../models/user.js");
const {regMemberOrg} = require("../models/student-org.js");
const {exclusiveMemberOrg} = require("../models/student-org.js");

const {interview} = require("../models/org-member.js");
const {RegOrgMember} = require("../models/org-member.js");
const {PendOrgMember} = require("../models/org-member.js");
const {RegOrgOfficer} = require("../models/org-member.js");
const {PendOrgOfficer} = require("../models/org-member.js");
const {interviewSched} = require("../models/org-member.js");


const app = express();

const urlencoder = bodyparser.urlencoded({
    extended: true
})

router.use(urlencoder)

router.use(cookieparser())
router.use(express.static(__dirname + "/public"))
router.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "secret",
    name: "mp2-cookie",
    cookie: {
        maxAge: 1000*60*60*24*365*5
    }
}))

router.post("/login", function(req, res){
    var //userId,
    username,
    password,
    realname,
    idNo,
    birthday,
    school,
    grade,
    job,
    residence,
        
    email,
    contactNo,
    address;
    
    username = req.body.username;
    password = req.body.password;
    realname = req.body.rn;
    idNo = req.body.idno;
    birthday = req.body.birthdate;
    school  = req.body.school;
    grade = req.body.schooltitle;
    job = req.body.job;
    
    residence = req.body.residence;
    favAlbums = req.body.favAlbums;
    
    email = req.body.email;
    contactNo = req.body.contactno;
    address = req.body.address;
    
    User.findOne(
        {username: username,
         password: password
        },
        function(err, doc){
            if(err){
                res.send(err)
            }
            else if(!doc){
                res.send("User does not exist. :(")
            }
            else{
                console.log(doc)

                req.session.username = doc.username
                res.redirect("/")
            }

        }
    )
    
})

router.get("/register.html", function(req, res){
    const path = require("path")
    res.sendFile(path.join(__dirname, '../public', "register.html"))
})

router.post("/register", function(req, res){
    var userId,
    username,
    password,
    realname,
    idNo,
    birthday,
    school,
    degree,
    job,
    residence,
        
    email,
    contactNo,
    address;
    
    username = req.body.username;
    password = req.body.password;
    realname = req.body.rn;
    idNo = req.body.idno;
    birthday = req.body.birthdate;
    school  = req.body.school;
    degree = req.body.schooltitle;
    job = req.body.job;
    
    residence = req.body.residence;
    
    email = req.body.email;
    contactNo = req.body.contactno;
    address = req.body.address;
    
    let user = new User({
        userId,
        username,
        password,
        realname,
        idNo,
        birthday,
        degree,
        email,
        contactNo,
        address,
        residence,
    })
    
    user.save().then(
        function(doc){
            console.log(doc);
            req.session.username = doc.username;
            req.session.password = doc.password;
            req.session.realname = doc.realname;
            req.session.idNo = doc.idNo;
            req.session.birthday = doc.birthday;
            req.session.degree = doc.degree;
            req.session.residence = doc.residence;
            
            req.session.email = doc.email;
            req.session.contactNo = doc.contactNo;
            req.session.address = doc.address;
            
            res.redirect("/");
        },
        
        function(err){
            res.send(err);
        }
    );
})

router.post("/profile", function(req, res){
    var username,
    password,
    realname,
    idNo,
    birthday,
    school,
    grade,
    job,
    residence,
        
    email,
    contactNo,
    address;

    username = req.body.username;
    realname = req.body.rn;
    idNo = req.body.idno;
    birthday = req.body.birthdate;
    grade = req.body.schooltitle;
    job = req.body.job;
    
    residence = req.body.residence;
    
    email = req.body.email;
    contactNo = req.body.contactno;
    address = req.body.address;
    
    console.log("User " + username);
    
    User.findOne(
        {username: username
         //,password: password
        },
        function(err, doc){
            if(err){
                res.send(err)
            }
            else if(!doc){
                res.send("User does not exist. :(")

            }
            else{
                console.log(doc)
                res.render("profile.hbs", {
                    user: doc,
                    username : req.session.username
                })
            }
            
        }
    )
    
})

router.get("/edit-profile", function(req, res){
    var id, username;

    id = req.body.id;
    username = req.body.username;
    
    console.log("User ID " + id);
    console.log("User " + username);
    
    User.findOne({
        _id: id
    }, 
    function(err, doc){
        if (err){
            res.render("edit-profile.hbs", {
                err
            })
        }
        else{
            res.render("edit-profile.hbs", {
                user: doc,
                username : req.session.username
            })
            console.log("Username: " + username)
        }
    })
    
})

router.post("/save-profile", function(req, res){
    var id,
    username,
    password,
    realname,
    idNo,
    birthday,
    school,
    grade,
    job,
    residence,
        
    email,
    contactNo,
    address;

    id = req.body.id;
    username = req.body.username;
    realname = req.body.rn;
    idNo = req.body.idno;
    birthday = req.body.birthdate;
    grade = req.body.schooltitle;
    job = req.body.job;
    
    residence = req.body.residence;
    
    email = req.body.email;
    contactNo = req.body.contactno;
    address = req.body.address;
    
    console.log("User ID " + id);
    console.log("User " + username);
    
    User.updateOne({
        _id: id
    }, {
        username,
        realname,
        idNo,
        birthday,
        grade,
        job,

        residence,

        email,
        contactNo,
        address
    },
    function(err, doc){
        if (err){
            res.render("edit-profile.hbs", {
                err
            })
        }
        else{
            res.redirect("/edit-profile")
        }
    })
    
})

router.get("/logout", function(req, res){
    req.session.destroy(
        function(err){
            console.log("Logged out.")
        }
    )
    res.redirect("/")
})


module.exports = router