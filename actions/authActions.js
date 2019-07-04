const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

Date.prototype.addDays = function(days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

const createToken = (userData) => {
  const exp = new Date().addDays(2).getTime();
  const payload = {
    _id: userData._id,
    email: userData.email,
    userName: userData.userName,
    exp,
  };

  return jwt.sign(payload, process.env.SECRET);
}

module.exports = {
  createToken,
}
