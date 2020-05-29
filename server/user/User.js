var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  user_firstname: String,
  user_lastname: String,
  user_username: {
    type: String,
    require: true,
    unique: true
  },
  user_password: {
    type: String,
    require: true,
  }
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
