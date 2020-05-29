let mongoose = require('mongoose');
let AntennaSchema = new mongoose.Schema({
  antenna_name: String,
  antenna_position_id: String,
  antenna_state: String
});
mongoose.model('Antenna', AntennaSchema);

module.exports = mongoose.model('Antenna');
