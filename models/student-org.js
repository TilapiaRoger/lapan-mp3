const mongoose = require("mongoose")
const mongooseextend = require("mongoose-extend-schema")

const User = require("../models/user.js");

var sch = mongoose.Schema;

var positionsSchema = mongoose.Schema({
    positionName: String,
    positionQuestions: [String],
    positionAssignments: [String],
    hasInterview: Boolean
})


var membersSchema = mongoose.Schema({
    currentMembers: [sch.Types.ObjectId],
    pendingMembers: [sch.Types.ObjectId],
    currentJrOfficers: [sch.Types.ObjectId],
    pendingJrOfficers: [sch.Types.ObjectId],
    currentSrOfficers: [sch.Types.ObjectId],
    pendingSrOfficers: [sch.Types.ObjectId]
})

var memAppSchema = mongoose.Schema({
    appQuestions: [String]
})

var orgSchema = mongoose.Schema({
    orgName: String,
    room: String,
    logoPath: String,
    description: String,
    isCurrentlyOpenforApply: Boolean,
    appDateStartandEnd: [Date],
    interviewDateStartandEnd: [Date],
    regAppForm: memAppSchema,
    joAppForm: memAppSchema,
    openPositions: [positionsSchema],
    joExclusivePositions: 
    [positionsSchema],
    joinCost: Number,
    membersSchema: membersSchema
})

//org database

var exclusiveOrgSchema = mongooseextend(orgSchema, {
    interviewDateStartandEnd: [Date]
})
var RegMemberOrg = mongoose.model("orgs", orgSchema)

var ExclusiveMemberOrg = mongoose.model("exorgs", orgSchema)
    
module.exports.create = function(org){
    return new Promise(function(resolve, reject){
        var o = new RegMemberOrg(org)
        
        o.save().then(function(newOrg){
            resolve(newOrg)
        }, function(err){
            reject(err)
        })
    })
} 

module.exports.getAll = function(){
    return new Promise(function(resolve, reject){
        RegMemberOrg.find().then(function(orgs){
            resolve(orgs)
        }, function(err){
            reject(err)
        }).catch(function(error){
          //assert(error)
      })
    })
} 

module.exports.get = function(org){
    return new global.Promise(function(resolve, reject){
      RegMemberOrg.findOne({
          orgName : org.orgName
      }).then(function(org){
          resolve(org)
      }, function(err){
          reject(err)
      })
    }).catch(function(error){
        console.log("Failed to show org details")
          //assert(error)
      })
}



module.exports.addPendingMember = function(org, user){
    return new global.Promise(function(resolve, reject){
      RegMemberOrg.updateOne(
            {
                orgName : org.orgName
            },
            {
                $push: {
                    "membersSchema.pendingMembers": user._id
                }
            }
        ).then(function(org){
          resolve(org)
      }, function(err){
          reject(err)
      })
    }).catch(function(error){
        console.log("Failed to show org details")
          //assert(error)
      })
}