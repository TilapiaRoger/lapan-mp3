const express = require("express");
const router = express.Router();

const session = require("express-session");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");

const auth = require("../middlewares/auth");

const {User} = require("../models/user.js");

const {RegMemberOrg} = require("../models/student-org.js");
const {ExclusiveMemberOrg} = require("../models/student-org.js");

const {RegOrgMember} = require("../models/org-member.js");
const {PendOrgMember} = require("../models/org-member.js");
const {RegOrgOfficer} = require("../models/org-member.js");
const {PendOrgOfficer} = require("../models/org-member.js");
const {interviewSched} = require("../models/org-member.js");

router.use("/user", require("./user"))
router.use("/org", require("./org"))

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/webapde", {
    useNewUrlParser: true
});

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

        mongoose.RegMemberOrg.aggregate([
            {
                $lookup:
                {
                    from: "ExclusiveMemberOrg",
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
        })
    }
    else{
        res.render("login.hbs")
        //const path = require("path")
        //res.sendFile(path.join(__dirname, '../public', "login.html"))
    }
})

module.exports = router