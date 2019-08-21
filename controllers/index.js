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

/*mongodb.MongoClient.connect("mongodb://localhost:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err, db){
    var orgsDB = db.db("webapde")
    var Org = orgsDB.collection("regMemberOrgs").aggregate([
        {
        $lookup: {
            from: "exclusiveMemberOrgs",
            localField: "_id",
            foreignField: "interviewDateStartandEnd",
            as: "orgs"
            }
        }
    ])
    console.log("Merged.");
})*/

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
        
        /*User.findOne(
            {username: req.session.username
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
                    RegMemberOrg.getAll().then(function(orgs){
                        res.render("home", {
                            curUser: doc,
                            orgs: orgs
                        })
                    })
                }

            }
        )*/
        
        
        
        /*let user = {
            username: req.session.username
        }
        
        User.get(user).then(function(user){
            console.log("Authenticating: " + newUser)

            if(user){
                req.session.username = user.username;

                console.log("HOME")

                RegMemberOrg.getAll().then(function(orgs){
                    res.render("home", {
                        curUser: user,
                        orgs: orgs
                    })
                })
            }
        }, function(error){
            res.send(error)
        }).catch(function(error){
              //assert(error)
        })*/

        
        /*User.get(user).then(function(user){
        console.log("Authenticating: " + newUser)
        
        if(newUser){
            req.session.username = user.username;
           
            console.log("HOME")
           
            RegMemberOrg.getAll().then(function(orgs){
                res.render("home", {
                    curUser: user,
                    orgs: orgs
                })
            })
        }
        }, function(error){
            res.send(error)
        }).catch(function(error){
              //assert(error)
        })*/
        
        
        /*User.get({
            username: req.session.username
        },
        function(err, doc){
            if(err){
                
            }
            else if (!doc){
                res.send("User does not exist. :(")
            }
            else{
                RegMemberOrg.getAll().then(function(orgs){
                    res.render("home", {
                        curUser: doc,
                        orgs: orgs
                    })
                })
            }
            
            }
        )*/
        
        /*RegMemberOrg.find({

        },
        function(err, docs){
            if(err){
                res.render("home.hbs", {
                    err
                })
            }
            else{
                res.render("home.hbs", {
                    orgs: docs,
                    err,
                    msg,
                    username : req.session.username
                })
            }
        })*/
    }
    else{
        res.render("login.hbs")
        //const path = require("path")
        //res.sendFile(path.join(__dirname, '../public', "login.html"))
    }
})

module.exports = router