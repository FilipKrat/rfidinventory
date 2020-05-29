let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let HistoryLog = require('./HistoryLog');
let VerifyToken = require('../auth/VerifyToken');



// RETURNS ALL HISTORYLOGS last 24 hours: done
router.get('/', VerifyToken, function (req, res, next) {
      let timestamp = Math.floor(Date.now() / 1000)-86400;
      HistoryLog.find(
           { timestamp: { $gt: timestamp } }, function (err, logs) {
            if (err){
              return res.status(500).send("There was a problem finding the logs.");
            }else{
              return res.status(200).send(logs);
            }
            });
    });

// RETURNS ALL HISTORYLOGS last 2 mins: done
router.get('/recent', VerifyToken, function (req, res, next) {
      let timestamp = Math.floor(Date.now() / 1000)-180;
      HistoryLog.find(
           { timestamp: { $gt: timestamp } }, function (err, logs) {
            if (err){
              return res.status(500).send("There was a problem finding the logs.");
            }else{
              return res.status(200).send(logs);
            }
            });
    });

module.exports = router;
