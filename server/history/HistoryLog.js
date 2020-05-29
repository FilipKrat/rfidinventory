let mongoose = require('mongoose');
let HistoryLogSchema = new mongoose.Schema({
  position_name: String,
  package_name: String,
  position_state: String,
  parts_amount: String,
  timestamp: Number
});
mongoose.model('HistoryLog', HistoryLogSchema);

module.exports = mongoose.model('HistoryLog');
