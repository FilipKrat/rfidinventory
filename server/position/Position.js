let mongoose = require('mongoose');
let PositionSchema = new mongoose.Schema({
  position_name: String,
  position_description: String,
  position_capacity: String
});
mongoose.model('Position', PositionSchema);

module.exports = mongoose.model('Position');
