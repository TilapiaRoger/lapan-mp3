const express = require("express");
const router = express.Router();
const session = require("express-session");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");

const auth = require("../middlewares/auth");

const User = require("../models/user.js");
const RegMemberOrg = require("../models/student-org.js");
const ExclusiveMemberOrg = require("../models/student-org.js");

const RegOrgMember = require("../models/org-member.js");
const PendOrgMember = require("../models/org-member.js");
const RegOrgOfficer = require("../models/org-member.js");
const PendOrgOfficer = require("../models/org-member.js");

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
    console.log("Logged in")
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
    
    let user = {
        username: req.body.username,
        password: req.body.password
    }
    
    realname = req.body.rn;
    idNo = req.body.idno;
    birthday = req.body.birthdate;
    grade = req.body.schooltitle;
    job = req.body.job;
    
    residence = req.body.residence;
    
    email = req.body.email;
    contactNo = req.body.contactno;
    address = req.body.address;

    User.authenticate(user).then(function(newUser){
        console.log("Authenticating: " + newUser)
        
        if(newUser){
            req.session.username = user.username;
           
            console.log("HOME")
           
            res.redirect("/")
           
        }
    }, function(error){
        res.send(error)
    }).catch(function(error){
          //assert(error)
      })
    
})

router.get("/new-user", function(req, res){
    res.render("register.hbs")
})

router.post("/register", function(req, res){
    let user = {
        username: req.body.username,
        password: req.body.password,
        realname: req.body.rn,
        idNo: req.body.idno,
        birthday: req.body.birthdate,
        degree: req.body.schooltitle,
        email: email = req.body.email,
        contactNo: req.body.contactno,
        address: req.body.address,
        residence: req.body.residence,
    }
    
    User.create(user).then(function(user){
        req.session.username = user.username;
           
            console.log("HOME")
            
            res.redirect("/")
        },
        function(error){
            res.send(error + " Registration failed.")
        }).catch(function(error){
          //assert(error)
      })
})

router.post("/profile", function(req, res){
    //console.log("User " + username);
    
    let user = {
        username: req.session.username
    }
        
    User.get(user).then(function(user){
        console.log("Authenticating: " + user)

        req.session.username = user.username;

        console.log("HOME")

        RegMemberOrg.getAll().then(function(orgs){
            res.render("profile", {
                user: user
            })
        })

    }, function(error){
        res.send(error)
    }).catch(function(error){
          //assert(error)
    })
    
})

router.get("/edit-profile", function(req, res){
    let user = {
        username: req.session.username
    }
        
    User.get(user).then(function(user){
        console.log("Authenticating: " + user)

        req.session.username = user.username;

        console.log("HOME")

        RegMemberOrg.getAll().then(function(orgs){
            res.render("edit-profile", {
                user: user
            })
        })

    }, function(error){
        res.send(error)
    }).catch(function(error){
          //assert(error)
    })
    
})

router.post("/save-profile", function(req, res){
    let user = {
        username: req.session.username
    }
    
    User.edit(user).then(function(user){
        console.log("Authenticating: " + user)

        req.session.username = user.username;

        console.log("PROFILE SAVED")

        res.render("edit-profile", {
            user: user
        })

    }, function(error){
        res.send(error)
    }).catch(function(error){
          //assert(error)
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