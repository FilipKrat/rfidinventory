let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let Antenna = require('./Antenna');
let VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW ANTENNA: done
    router.post('/', VerifyToken, function (req, res, next) {
        if(!req.body){
          res.status(400).send("Request body is missing!");
        }
          if(!req.body.antenna_name){
            res.status(400).send("Antenna name is missing!");
          }
          if(req.body.antenna_name.length === 0){
            res.status(400).send("Antenna name is missing!");
          }
          if(!req.body.antenna_position_id){
            res.status(400).send("Antenna name is missing!");
          }
          if(req.body.antenna_position_id.length === 0){
            res.status(400).send("Position of antenna is missing!");
          }
          if(!req.body.antenna_state){
            res.status(400).send("Antenna state is missing!");
          }
          if(req.body.antenna_state.length === 0){
            res.status(400).send("Antenna state is missing!");
          }
          Antenna.create({
                  antenna_name : req.body.antenna_name,
                  antenna_position_id : req.body.antenna_position_id,
                  antenna_state : req.body.antenna_state
              },
              function (err, antenna) {
                  if (err) return res.status(500).send("There was a problem adding the information to the database.");
                  res.status(200).send({status:'success'});
              });
        });

// CHANGE ANTENNA STATE: done
    router.put('/:id', VerifyToken, function (req, res, next) {
        if(!req.body){
          res.status(400).send("Request body is missing!");
        }
          if(!req.params.id){
            res.status(400).send("Antenna ID is missing!");
          }
          if(req.params.id.length === 0){
            res.status(400).send("Antenna ID is missing!");
          }
          if(!req.body.antenna_state){
            res.status(400).send("State of antenna is missing!");
          }
          if(req.body.antenna_state.length === 0){
            res.status(400).send("State of antenna is missing!");
          }
          if(!req.body.antenna_position_id){
            res.status(400).send("Antenna name is missing!");
          }
          if(req.body.antenna_position_id.length === 0){
            res.status(400).send("Position of antenna is missing!");
          }
          if(!req.body.antenna_state){
            res.status(400).send("Antenna state is missing!");
          }
          if(req.body.antenna_state.length === 0){
            res.status(400).send("Antenna state is missing!");
          }
          Antenna.updateOne({"_id":req.params.id},{$set:{
                  antenna_name : req.body.antenna_name,
                  antenna_position_id : req.body.antenna_position_id,
                  antenna_state: req.body.antenna_state
              }},
              function (err,result) {
                  if (err){
                    return res.status(500).send("There was a problem updating the information in the database.");
                  }
                  else{
                    return res.status(200).send({status:'success'});
                  }
              });
            });

        router.get('/:id', VerifyToken, function (req, res, next) {
              if(!req.params.id){
                res.status(400).send("Antenna ID is missing!");
              }
              if(req.params.id.length === 0){
                res.status(400).send("Antenna ID is missing!");
              }
              Antenna.findOne(
                  {_id: req.params.id}, function (err, antenna) {
                    if (err){
                      return res.status(500).send("There was a problem finding the antenna.");
                    }else{
                      return res.status(200).send(antenna);
                    }
                  });
        });

// RETURNS ALL ANTENNAS: done
router.get('/', VerifyToken, function (req, res, next) {
      Antenna.find(
          {}, function (err, antennas) {
            if (err){
              return res.status(500).send("There was a problem finding the packages.");
            }else{
              return res.status(200).send(antennas);
            }
            });
    });

// REMOVE ANTENNA: done
router.delete('/:id', VerifyToken, function (req, res, next) {

      if(!req.params.id){
        res.status(400).send("Antenna ID is missing!");
      }
      if(req.params.id.length === 0){
        res.status(400).send("Antenna ID is missing!");
      }
      Antenna.deleteOne({"_id":req.params.id},
          function (err, result) {
              if (err) return res.status(500).send("There was a problem removing the information from the database.");
              res.status(200).send({status:'success'});
          });
      });

module.exports = router;
