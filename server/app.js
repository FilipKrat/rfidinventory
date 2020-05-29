let express = require('express');
let path = require('path');
let cors = require('cors');
let bodyParser = require('body-parser');
let app = express();
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
let server = require('http').createServer(app);
let db = require('./db');
let users = {};

app.use(express.static(path.join(__dirname, 'build')));

//server.listen(process.env.PORT || 3000);
let PackageController = require('./package/PackageController');
app.use('/packaging', PackageController);
let AntennaController = require('./antenna/AntennaController');
app.use('/antennas', AntennaController);
let PositionController = require('./position/PositionController');
app.use('/positions', PositionController);
let HistoryLogController = require('./history/HistoryLogController');
app.use('/history', HistoryLogController);
let AuthController = require('./auth/AuthController');
app.use('/api/auth', AuthController);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = app;
