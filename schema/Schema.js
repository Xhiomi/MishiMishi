const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: false,
  },
  age: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
})

const CatSchema = new Schema({
  color: {
    type: String,
    required: false,
  },
  size: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  age: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
})

mongoose.Types.ObjectId.prototype.valueOf = function(){
  return this.toString();
};

UserSchema.pre("save", function (next) {
  let user = this;
  if(!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, function (error, salt) {
      bcrypt.hash(user.password, salt, function (error, hash) {
        if(error) return next(error);
        user.password = hash;
        next();
      })
    })
});

module.exports = { CatSchema, UserSchema };
