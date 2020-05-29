let mongoose = require('mongoose');
let PackageSchema = new mongoose.Schema({
  package_name: String,
  package_position_id: String,
  parts_amount: String,
  package_timestamp: Number,
  package_state: String
});
mongoose.model('Package', PackageSchema);

module.exports = mongoose.model('Package');
