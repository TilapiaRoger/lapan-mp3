const express = require("express");
const router = express.Router();

const session = require("express-session");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
const mongodb = require("mongodb");

const auth = require("../middlewares/auth");

const {User} = require("../models/user.js");

const {RegMemberOrg} = require("../models/student-org.js");
const {ExclusiveMemberOrg} = require("../models/student-org.js");

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

router.get("/org-list", function(req, res){
    
    console.log("Organization List Accessed")
    var err, msg;
    
    err = req.session.err;
    msg = req.session.msg;
    
    req.session.err = null;
    req.session.msg = null;
    
    /*db.collection("regMemberOrg").aggregate([
        {
            $lookup:
            {
                from: "exclusiveMemberOrg",
                localField: "orgName",
                foreignField: "interviewDateStartandEnd",
                as: "Org"
            }
        }
    ])*/
    
    let user = {
        username: req.session.username
    }

    User.get(user).then(function(user){
        console.log("Authenticating: " + user)

        req.session.username = user.username;

        console.log("HOME")

        RegMemberOrg.getAll().then(function(orgs){
            res.render("org-list", {
                curUser: user,
                orgs: orgs
            })
        })

    }, function(error){
        res.send(error)
    }).catch(function(error){
          //assert(error)
    })
    
    /*exclusiveMemberOrg.find({
        
    },
    function(err, docs){
        if(err){
            res.render("org-list.hbs", {
                err
            })
        }
        else{
            res.render("org-list.hbs", {
                exOrgs: docs,
                err,
                msg,
                username : req.session.username
            })
        }
    })
    
    regMemberOrg.find({
        
    },
    function(err, docs){
        if(err){
            res.render("org-list.hbs", {
                err
            })
        }
        else{
            res.render("org-list.hbs", {
                regOrgs: docs,
                err,
                msg,
                username : req.session.username
            })
        }
    })*/
})


router.get("/my-org-list", function(req, res){
    console.log("Organization List Accessed")
    var err, msg;
    
    err = req.session.err;
    msg = req.session.msg;
    
    req.session.err = null;
    req.session.msg = null;
    
    db.regMemberOrg.aggregate([
        {
            $lookup:
            {
                from: "exclusiveMemberOrg",
                localField: "orgName",
                foreignField: "interviewDateStartandEnd",
                as: "Org"
            }
        }
    ])
    
    Org.find({
        
    },
    function(err, docs){
        if(err){
            res.render("org-list.hbs", {
                err
            })
        }
        else{
            res.render("my-orgs-list.hbs", {
                orgs: docs,
                err,
                msg,
                username : req.session.username
            })
        }
    }
    )
})

router.get("/my-org-members", function(req, res){
    res.render("members-list.hbs")
    
})

/*router.post("/result-request", function(req, res){
    res.render("members-list.hbs",{
        username : req.session.username
    })
    
})*/

router.post("/org-profile", function(req, res){
    var //userId,
    orgName,
    room,
    description;

    orgName = req.body.orgName;
    room = req.body.room;
    description = req.body.description;
    
    console.log("User " + orgName);
    
    Org.findOne(
        {orgName: orgName,
         description: description
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
                res.render("org-profile.hbs", {
                    org: doc,
                    username : req.session.username
                })
            }
            
        }
    )
    
})

router.post("/my-org-profile", function(req, res){
    var //userId,
    orgName,
    room,
    description;

    orgName = req.body.orgName;
    room = req.body.room;
    description = req.body.description;
    
    console.log("User " + orgName);
    
    Org.findOne(
        {orgName: orgName,
         description: description
        },
        function(err, doc){
            if(err){
                res.send(err)
            }
            else if(!doc){
                res.send("Org does not exist.")

            }
            else{
                console.log(doc)
                res.render("my-org-profile.hbs", {
                    org: doc,
                    username : req.session.username
                })
            }
            
        }
    )
})


router.get("/requests", function(req, res){
    
    res.render("requests.hbs",{
        username : req.session.username
    })
    
    //full implementation of sending moderator request to be fulfilled in phase 3
})

router.post("/delete", function(req, res){
    res.render("requests.hbs", {
        username : req.session.username
    })
})

router.post("/apply-membership", function(req, res){
    var username;
    
    var orgName, description, positions;

    username = req.body.username;
    
    orgName = req.body.orgName;
    description = req.body.description;
    positions = req.body.openPositions;
    
    res.render("org-profile.hbs", {
        username : req.session.username
    })
    
    Org.findOne(
        {orgName: orgName,
         description: description
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
                res.render("org-app.hbs", {
                    org: doc,
                    username: req.session.username
                })
            }
            
        }
    )
    
    //full implementation of sending moderator request to be fulfilled in phase 3
})

router.post("/check-membership", function(req, res){
    
    res.render("members-list.hbs", {
        username : req.session.username
    })
    
    //full implementation of sending moderator request to be fulfilled in phase 3
})

/*router.post("/submit-application", function(req, res){
    var username,
    idNo,
    orgName,
    orgId,
    curPosition,
    isAccepted;
    
    idNo = req.body.username;
    username = req.body.username;
    password = req.body.password;
    isAccepted = false;
    
    User.findOne(
        {username: username
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
                res.render("org-profile.hbs", {
                    username: username
                })
            }
            
        }
    )
    
    //adding pending members would be implemented in phase 3
    
})*/

module.exports = router