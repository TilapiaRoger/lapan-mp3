const mongoose = require("mongoose")

var sch = mongoose.Schema;

var interviewSchema = mongoose.Schema({
    interviewDate: Date,
    interviewComplete: Boolean
})

var orgMemberSchema = mongoose.Schema({
    userIdNo: sch.Types.ObjectId,
    orgId: sch.Types.ObjectId,
    curDepartment: String,
    questionAnswers: [String],
    interview: interviewSchema
})

var orgOfficerSchema = mongoose.Schema({
    userIdNo: sch.Types.ObjectId,
    orgId: sch.Types.ObjectId,
    curDepartment: String,
    questionAnswers: [String],
    curPosition: String,
    isMod: Boolean
})

//extend databases

//extended results
var RegOrgMember = mongoose.model("regOrgMembers", orgMemberSchema)

var PendOrgMember = mongoose.model("pendOrgMembers", orgMemberSchema)


var RegOrgOfficer = mongoose.model("regOrgOfficers", orgOfficerSchema)

var PendOrgOfficer = mongoose.model("pendOrgOfficers", orgOfficerSchema)

module.exports.getMemberRequest = function(member){
    return new global.Promise(function(resolve, reject){
        var pm = new PendOrgMember(member);
        
        pm.save().then(function(reqMember){
            console.log(reqMember)
            resolve(reqMember)
        }, function(err){
            reject(err)
        })
    }).catch(function(error){
        console.log(error)
      })
}