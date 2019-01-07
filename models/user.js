var mongoose = require("mongoose");
var passportlocalmongoose = require("passport-local-mongoose");

var Userschema = new mongoose.Schema({
   username:String,
   password:String
});

Userschema.plugin(passportlocalmongoose);

module.exports = mongoose.model("User",Userschema);