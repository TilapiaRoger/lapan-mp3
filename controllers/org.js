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

const RegOrgMember = require("../models/org-member.js");
const PendOrgMember = require("../models/org-member.js");
const RegOrgOfficer = require("../models/org-member.js");
const PendOrgOfficer = require("../models/org-member.js");
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

router.get("/new-org", function(req, res){
    let user = {
        username: req.session.username
    }
    
    User.get(user).then(function(user){
        res.render("new-org", {
            user: user
        });

    }, function(error){
        res.send(error)
    }).catch(function(error){
          //assert(error)
    })
})
           
router.post("/create-org", function(req, res){
    var user = {
        username: req.session.username
    }
    
    let org = {
        orgName: req.body.orgName,
        room: req.body.room,
        logoPath: req.body.icon,
        description: req.body.description
    }
    
    let msg = "Org created!"
    
    RegMemberOrg.create(org).then(function(org){
        User.get(user).then(function(user){
            
            req.session.username = user.username;
            res.render("new-org", {
                msg: msg,
                user: user
            });

        }, function(error){
            res.send(error)
        }).catch(function(error){
              //assert(error)
        })
        
        RegMemberOrg.getAll().then(function(orgs){
            console.log(orgs)
            res.render("home", {
                user: user,
                orgs: orgs
            });
        })
        
        },
        function(error){
            res.send(error + " Registration failed.")
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
    
})

router.post("/check-membership", function(req, res){
    
    res.render("members-list.hbs", {
        username : req.session.username
    })
})

router.post("/submit-application", function(req, res){
    var user = {
        username: req.body.username
    }
    
    User.get(user).then(function(user){
        req.body.username = user.username;

        var org = {
            orgName: req.body.orgName
        }
        
        console.log("USER APPLY: " + user._id)
        console.log("ORG APPLY: " + org)
        
        RegMemberOrg.addPendingMember(org, user).then(function(org, user){
            req.body.orgName = org.orgName;
            
            console.log("USER APPLY: " + user._id)
            console.log("ORG APPLY: " + org)
            
            let member = {
                userIdNo: user._id,
                orgId: org._id,
                curDepartment: req.body.dept,
                questionAnswers: [req.body.answer],
                interview: null
            }
            
            console.log("ORG APPLY: " + member)
            PendOrgMember.getMemberRequest(member).then(function(member){
                user._id = member.userIdNo;
                    console.log("Member Stats: " + member)

                    res.render("org-profile", {
                        user: user,
                        org: org
                    })
                },
                function(error){
                    res.send(error + " Application failed.")
                }).catch(function(error){
                  //assert(error)
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


module.exports = router