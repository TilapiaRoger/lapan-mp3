const express = require("express");
const router = express.Router();

const session = require("express-session");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
const mongodb = require("mongodb");

const auth = require("../middlewares/auth");

const User = require("../models/user.js");

const RegMemberOrg = require("../models/student-org.js");
const {ExclusiveMemberOrg} = require("../models/student-org.js");

const {RegOrgMember} = require("../models/org-member.js");
const {PendOrgMember} = require("../models/org-member.js");
const {RegOrgOfficer} = require("../models/org-member.js");
const {PendOrgOfficer} = require("../models/org-member.js");
const {interviewSched} = require("../models/org-member.js");

var Org = RegMemberOrg;

router.use("/user", require("./user"))
router.use("/org", require("./org"))


const urlencoder = bodyparser.urlencoded({
    extended: true
})

const app = express();

router.get(["/", "/home"], function(req, res){
    //res.sendFile(__dirname + "/public/login.html")
    
    if(req.session.username){
        console.log("Organization List Accessed")
        var err, msg;

        err = req.session.err;
        msg = req.session.msg;

        req.session.err = null;
        req.session.msg = null;
        
        let user = {
            username: req.session.username
        }
        
        User.get(user).then(function(user){
            console.log("Authenticating: " + user)

            req.session.username = user.username;

            console.log("HOME")

            RegMemberOrg.getAll().then(function(orgs){
                res.render("home", {
                    curUser: user,
                    orgs: orgs
                })
            })
            
        }, function(error){
            res.send(error)
        }).catch(function(error){
              //assert(error)
        })
        
    }
    else{
        res.render("login.hbs")
    }
})

module.exports = router