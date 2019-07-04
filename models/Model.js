const mongoose = require('mongoose');

const { UserSchema, CatSchema } = require('../schema/Schema.js');

const UserModel = mongoose.model("user", UserSchema);
const CatModel = mongoose.model("cat", CatSchema);

module.exports = {
  UserModel,
  CatModel,
}
