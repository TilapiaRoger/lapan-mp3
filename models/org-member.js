const mongoose = require("mongoose")

var ObjectId = mongoose.Types.ObjectId;

var interviewSchema = mongoose.Schema({
    interviewDay: String,
    interviewTime: String,
    interviewComplete: Boolean
})

var interviewSched = mongoose.model("interviews", interviewSchema)

var orgMemberSchema = mongoose.Schema({
    userIdNo: String,
    orgId: ObjectId,
    curPosition: String
})

var orgOfficerSchema = mongoose.Schema({
    userIdNo: String,
    orgId: ObjectId,
    curPosition: String,
    isMod: Boolean
})

//extend databases
function extendSchema(Schema, definition, options){
    return new mongoose.Schema(
        Object.assign({}, Schema.obj, definition),
        options
    );
}

//extended results
var regOrgMemberSchema = extendSchema(orgMemberSchema, {
})
var RegOrgMember = mongoose.model("regOrgMembers", regOrgMemberSchema)

var pendOrgMemberSchema = extendSchema(orgMemberSchema, {
    interview: {type: interviewSchema, required: true}
})
var PendOrgMember = mongoose.model("pendOrgMembers", pendOrgMemberSchema)


var regOrgOfficerSchema = extendSchema(orgOfficerSchema, {
})
var RegOrgOfficer = mongoose.model("regOrgOfficers", regOrgOfficerSchema)

var pendOrgOfficerSchema = extendSchema(orgOfficerSchema, {
    interview: {type: interviewSchema, required: true}
})
var PendOrgOfficer = mongoose.model("pendOrgOfficers", pendOrgOfficerSchema)


module.exports = {
    RegOrgMember,
    PendOrgMember,
    RegOrgOfficer,
    PendOrgOfficer,
    interviewSched
}