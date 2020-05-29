let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let Package = require('./Package');
let Antenna = require('../antenna/Antenna');
let Position = require('../position/Position');
let HistoryLog = require('../history/HistoryLog');
let VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW PACKAGE: done
router.post('/', VerifyToken, function (req, res, next) {
    if(!req.body){
      res.status(400).send("Request body is missing!");
    }
    if(req.body.user_id == req.userId){
      if(!req.body.package_name|| !req.body.package_position_id){
        res.status(400).send("Package name or position ID is missing!");
      }
      if(req.body.package_name.length === 0 || req.body.package_position_id.length === 0){
        res.status(400).send("Package name or position ID is missing!");
      }
      if(!req.body.parts_amount){
        res.status(400).send("Amount of parts in package is missing!");
      }
      if(req.body.parts_amount.length === 0){
        res.status(400).send("Amount of parts in package is missing!");
      }
      if(!req.body.package_state){
        res.status(400).send("New package state is missing!");
      }
      if(req.body.package_state.length === 0){
        res.status(400).send("New package state is missing!");
      }
      Package.create({
              package_name : req.body.package_name,
              package_position_id : req.body.package_position_id,
              parts_amount : req.body.parts_amount,
              package_timestamp: Math.floor(Date.now() / 1000),
              package_state: req.body.package_state
          },
          function (err, package) {
              if (err) return res.status(500).send("There was a problem adding the information to the database.");
              res.status(200).send({status:'success'});
          });
        }else return res.status(500).send({ auth: false, message: 'Failed to authenticate user.' });
    });


    // UPDATES PACKAGE STATUS: done
    router.put('/move-package/:id', function (req, res) {
        if(!req.body){
          res.status(400).send("Request body is missing!");
        }
          if(!req.params.id){
            res.status(400).send("Package ID is missing!");
          }
          if(req.params.id.length === 0){
            res.status(400).send("Package ID is missing!");
          }
          if(!req.body.antenna_id){
            res.status(400).send("New package state is missing!");
          }
          if(req.body.antenna_id.length === 0){
            res.status(400).send("New package state is missing!");
          }
          Antenna.findOne(
              {antenna_name: req.body.antenna_id}, function (err, antenna) {
                if (err){
                  return res.status(500).send("There was a problem finding the antenna.");
                }else{
                  let package_state = antenna.antenna_state;
                  let position_id = antenna.antenna_position_id;
                  Position.findOne(
                      {_id: position_id}, function (err, position) {
                        if (err){
                          return res.status(500).send("There was a problem finding the position.");
                        }else{
                          let position_name = position.position_name;
                          let timestamp = Math.floor(Date.now() / 1000);
                          Package.updateOne({"package_name":req.params.id}, {$set:{
                                  package_state: package_state,
                                  package_timestamp: timestamp
                              }},
                              function (err, result) {
                                  if (err) return res.status(500).send("There was a problem updating the information in the database.");
                                  Package.findOne(
                                      {package_name: req.params.id}, function (err, package) {
                                        if (err){
                                          return res.status(500).send("There was a problem finding the position.");
                                        }else{
                                  HistoryLog.create({
                                    position_name: position_name,
                                    package_name: req.body.package_id,
                                    position_state: package_state,
                                    parts_amount: package.parts_amount,
                                    timestamp: timestamp
                                  },
                                  function (err, log) {
                                      if (err) return res.status(500).send("There was a problem adding the information to the database.");
                                      res.status(200).send({status:'success'});
                                  });
                                  }
                                });
                              });
                          }
                        });
                    }
              });
        });


        router.get('/:id', VerifyToken, function (req, res, next) {
              if(!req.params.id){
                res.status(400).send("Packaging ID is missing!");
              }
              if(req.params.id.length === 0){
                res.status(400).send("Packaging ID is missing!");
              }
              Package.findOne(
                  {_id: req.params.id}, function (err, packaging) {
                    if (err){
                      return res.status(500).send("There was a problem finding the packaging.");
                    }else{
                      return res.status(200).send(packaging);
                    }
                  });
                });

// UPDATES PACKAGE: done
        router.put('/:id', VerifyToken, function (req, res, next) {
            if(!req.body){
              res.status(400).send("Request body is missing!");
            }
              if(!req.params.id){
                res.status(400).send("Package ID is missing!");
              }
              if(req.params.id.length === 0){
                res.status(400).send("Package ID is missing!");
              }
              if(!req.body.package_name){
                res.status(400).send("Package name is missing!");
              }
              if(req.body.package_name.length === 0){
                res.status(400).send("Package name is missing!");
              }
              if(!req.body.package_position_id){
                res.status(400).send("Position ID is missing!");
              }
              if(req.body.package_position_id.length === 0){
                res.status(400).send("Position ID is missing!");
              }
              if(!req.body.parts_amount){
                res.status(400).send("Amount of parts in package is missing!");
              }
              if(req.body.parts_amount.length === 0){
                res.status(400).send("Amount of parts in package is missing!");
              }
              if(!req.body.package_state){
                res.status(400).send("New package state is missing!");
              }
              if(req.body.package_state.length === 0){
                res.status(400).send("New package state is missing!");
              }
              Package.updateOne({"_id":req.params.id}, {$set:{
                      package_name: req.body.package_name,
                      package_position_id: req.body.package_position_id,
                      parts_amount: req.body.parts_amount,
                      package_timestamp: Math.floor(Date.now() / 1000),
                      package_state: req.body.package_state
                  }},
                  function (err, result) {
                      if (err) return res.status(500).send("There was a problem updating the information in the database.");
                      res.status(200).send({status:'success'});
                  });
            });

// RETURNS ALL PACKAGES: done
router.get('/', VerifyToken, function (req, res, next) {
      Package.find(
          {}, function (err, packages) {
            if (err){
              return res.status(500).send("There was a problem finding the packages.");
            }else{
              return res.status(200).send(packages);
            }
          });
        });

// REMOVE PACKAGE: done
router.delete('/:id', VerifyToken, function (req, res, next) {
      if(!req.params.id){
        res.status(400).send("Package ID is missing!");
      }
      if(req.params.id.length === 0){
        res.status(400).send("Package ID is missing!");
      }
      Package.deleteOne({"_id":req.params.id},
          function (err, result) {
              if (err) return res.status(500).send("There was a problem removing the information from the database.");
              res.status(200).send({status:'success'});
          });
    });


module.exports = router;
