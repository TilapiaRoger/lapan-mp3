const mongoose = require("mongoose")
const crypto = require("crypto")

var sch = mongoose.Schema;

const RegMemberOrg = require("../models/student-org.js");


var memberInfoSchema = mongoose.Schema({
    orgId: sch.Types.ObjectId,
    memberDepartment: String,
    memberAnswers: [String]
})

var orgMembershipStatusSchema = mongoose.Schema({
    currentOrgsInfo: [memberInfoSchema],
    pendingOrgsInfo: [memberInfoSchema]
})

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    realname: String, 
    idNo: String,
    birthday: Date,
    degree: String,
    email: String,
    contactNo: String,
    address: String,
    residence: String,
    orgLists: [orgMembershipStatusSchema]
})

userSchema.pre("save", function(next){
    this.password = crypto.createHash("md5").update(this.password).digest("hex")
    next()
})

var User = mongoose.model("users", userSchema)

module.exports.create = function(user){
    return new global.Promise(function(resolve, reject){
        var u = new User(user)
        
        u.save().then(function(newUser){
            console.log(newUser)
            resolve(newUser)
        }, function(err){
            reject(err)
        })
    }).catch(function(error){
        
          //assert(error)
      })
}

module.exports.authenticate = function(user){
    return new global.Promise(function(resolve, reject){
        User.findOne({
            username : user.username,
            password: crypto.createHash("md5").update(user.password).digest("hex")
        }).then(function(user){
            console.log("Callback user: " + user)
            resolve(user)
        }, function(err){
            reject(err)
        })
    }).catch(function(error){
        console.log("Failed log in")
          //assert(error)
      })
}

module.exports.get = function(user){
    return new global.Promise(function(resolve, reject){
      User.findOne({
          username : user.username
      }).then(function(user){
          resolve(user)
      }, function(err){
          reject(err)
      })
    }).catch(function(error){
        console.log("Failed log in")
          //assert(error)
      })
}

module.exports.edit = function(user){
    return new global.Promise(function(resolve, reject){
      User.findOneandUpdate({
          username : user.username
      }, update, {
          new: true
      }).then(function(user){
          resolve(user)
      }, function(err){
          reject(err)
      })
    }).catch(function(error){
        console.log("Failed log in")
          //assert(error)
      })
}

module.exports.sendMembershipRequest = function(org, user){
    return new global.Promise(function(resolve, reject){
      User.updateOne(
            {
                username : user.username
            },
            {
                $push: {
                    "orgLists.pendingOrgsId": org._id
                }
            }
        ).then(function(user){
          resolve(user)
      }, function(err){
          reject(err)
      })
    }).catch(function(error){
        console.log("Failed to show org details")
          //assert(error)
      })
}



