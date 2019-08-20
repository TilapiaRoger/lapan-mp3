const mongoose = require("mongoose")

var sch = mongoose.Schema;

var membersSchema = mongoose.Schema({
    currentMembersId: [sch.Types.ObjectId],
    pendingMembersId: [sch.Types.ObjectId],
    currentJrOfficersId: [sch.Types.ObjectId],
    pendingJrOfficersId: [sch.Types.ObjectId],
    currentSrOfficersId: [sch.Types.ObjectId],
    pendingSrOfficersId: [sch.Types.ObjectId]
})

var memAppSchema = mongoose.Schema({
    appQuestions: [String]
})

var orgSchema = mongoose.Schema({
    orgName: String,
    room: String,
    description: String,
    openPositions: [String],
    exclusivePositions: [String],
    logoPath: String,
    isCurrentlyOpenforApply: Boolean,
    appDateStartandEnd: [Date],
    regAppForm: memAppSchema,
    joAppForm: memAppSchema,
    membersSchema: membersSchema,
    joinCost: Number
})


function extendSchema(Schema, definition, options){
    return new mongoose.Schema(
        Object.assign({}, Schema.obj, definition),
        options
    );
}

//org database
var regOrgSchema = extendSchema(orgSchema, {})

var exclusiveOrgSchema = extendSchema(orgSchema, {
    assignments: [String],
    interviewDateStartandEnd: [Date]
})

var RegMemberOrg = mongoose.model("regMemberOrgs", regOrgSchema)

var ExclusiveMemberOrg = mongoose.model("exclusiveMemberOrgs", exclusiveOrgSchema)

module.exports = {
    RegMemberOrg,
    ExclusiveMemberOrg
}