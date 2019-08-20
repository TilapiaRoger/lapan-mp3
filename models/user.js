const mongoose = require("mongoose")
const crypto = require("crypto")

var userSchema = mongoose.Schema({
    userId: String,
    username: String,
    password: String,
    realname: String, 
    idNo: String,
    birthday: Date,
    degree: String,
    email: String,
    contactNo: String,
    address: String,
    residence: String
})

userSchema.pre("save", function(next){
    this.password = crypto.createHash("md5").update(this.password).digest("hex");
    next();
})

var User = mongoose.model("users", userSchema)

module.exports = {
    User
}

