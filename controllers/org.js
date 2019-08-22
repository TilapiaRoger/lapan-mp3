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
    
    let user = {
        username: req.session.username
    }
        
    User.get(user).then(function(user){
        console.log("Authenticating: " + user)

        req.session.username = user.username;

        console.log("")

        RegMemberOrg.getAll().then(function(orgs){
            res.render("org-list", {
                user: user,
                orgs: orgs
            })
        })

    }, function(error){
        res.send(error)
    }).catch(function(error){
          //assert(error)
    })
})


router.get("/my-org-list", function(req, res){
    let user = {
        username: req.session.username
    }
        
    User.get(user).then(function(user){
        console.log("Authenticating: " + user)

        req.session.username = user.username;

        console.log("HOME")

        RegMemberOrg.getAll().then(function(orgs){
            console.log(orgs)
            res.render("org-list", {
                user: user,
                orgs: orgs
            })
        })

    }, function(error){
        res.send(error)
    }).catch(function(error){
          //assert(error)
    })
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
    var user = {
        username: req.session.username
    }
    
    
    User.get(user).then(function(user){
        req.session.username = user.username;

        var org = {
            orgName: req.body.orgName
        }
        
        console.log(org);
        
        RegMemberOrg.get(org).then(function(org){
            req.body.orgName = org.orgName;
            
            console.log("ORG PROFILE: " + org)
            res.render("org-profile", {
                user: user,
                org: org
            })
        }).catch(function(error){
          //assert(error)
    })

    }, function(error){
        res.send(error)
    }).catch(function(error){
          //assert(error)
    })
    
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
    var user = {
        username: req.session.username
    }
    
    
    User.get(user).then(function(user){
        req.session.username = user.username;

        var org = {
            orgName: req.body.orgName
        }
        
        console.log(org);
        
        RegMemberOrg.get(org).then(function(org){
            req.body.orgName = org.orgName;
            
            console.log("ORG APPLY: " + org)
            res.render("member-app", {
                user: user,
                org: org
            })
        }).catch(function(error){
          //assert(error)
    })

    }, function(error){
        res.send(error)
    }).catch(function(error){
          //assert(error)
    })
    
    //full implementation of sending moderator request to be fulfilled in phase 3
})

router.post("/check-membership", function(req, res){
    
    res.render("members-list.hbs", {
        username : req.session.username
    })
    
    //full implementation of sending moderator request to be fulfilled in phase 3
})

router.post("/submit-application", function(req, res){
    var user = {
        username: req.session.username
    }
    
    
    User.get(user).then(function(user){
        req.session.username = user.username;

        var org = {
            orgName: req.body.orgName
        }
        
        console.log(org);
        
        RegMemberOrg.get(org).then(function(org){
            req.body.orgName = org.orgName;
            
            /*RegMemberOrg.findOneAndUpdate(
                {
                    orgName: req.body.orgName
                },
                {
                    $push: {"membersSchema.pendingMembersId": user.body.userId
                    },
                    {
                        new: true
                    },
                    function(err, result){
                        console.log("Added " + user.body.userId + " to " + org)
                    }
                })*/
            console.log("ORG APPLY: " + org)
            res.render("org-profile", {
                user: user,
                org: org
            })
        }).catch(function(error){
          //assert(error)
    })

    }, function(error){
        res.send(error)
    }).catch(function(error){
          //assert(error)
    })
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