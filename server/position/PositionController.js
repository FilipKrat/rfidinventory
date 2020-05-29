let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
let Position= require('./Position');
let Antenna= require('../antenna/Antenna');
let Package= require('../package/Package');
let VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW POSITION: done
router.post('/', VerifyToken, function (req, res, next) {
    if(!req.body){
      res.status(400).send("Request body is missing!");
    }
      if(!req.body.position_name){
        res.status(400).send("Position name is missing!");
      }
      if(req.body.position_name.length === 0){
        res.status(400).send("Position name is missing!");
      }
      if(!req.body.position_desc){
        res.status(400).send("Position description is missing!");
      }
      if(req.body.position_desc.length === 0){
        res.status(400).send("Position description is missing!");
      }
      if(!req.body.position_capacity){
        res.status(400).send("Position capacity is missing!");
      }
      if(req.body.position_capacity.length === 0){
        res.status(400).send("Position capacity is missing!");
      }
      Position.create({
              position_name : req.body.position_name,
              position_description: req.body.position_desc,
              position_capacity: req.body.position_capacity
          },
          function (err, position) {
              if (err) return res.status(500).send("There was a problem adding the information to the database.");
              res.status(200).send({status:'success'});
          });
          });


    // REMOVE POSITION: done
    router.delete('/:id', VerifyToken, function (req, res, next) {
          if(!req.params.id){
            res.status(400).send("Position ID is missing!");
          }
          if(req.params.id.length === 0){
            res.status(400).send("Position ID is missing!");
          }
          Antenna.updateMany({"antenna_position_id" : req.params.id}, {$set:{
                  antenna_position_id: "N/A"
              }},function (err, result) {
                  if (err) return res.status(500).send("There was a problem updating the information from the database.");
              });
          Package.updateMany({"package_position_id" : req.params.id}, {$set:{
                    package_position_id: "N/A"
                   }},function (err, result) {
                      if (err) return res.status(500).send("There was a problem updating the information from the database.");
                  });
          Position.deleteOne({"_id":req.params.id},
              function (err, result) {
                  if (err) return res.status(500).send("There was a problem removing the information from the database.");
                  res.status(200).send({status:'success'});
              });
          });


// RETURNS ALL POSITIONS: done
router.get('/', VerifyToken, function (req, res, next) {
      Position.find(
          {}, function (err, positions) {
            if (err){
              return res.status(500).send("There was a problem finding the positions.");
            }else{
              return res.status(200).send(positions);
            }
          });

});

router.get('/:id', VerifyToken, function (req, res, next) {
      if(!req.params.id){
        res.status(400).send("Position ID is missing!");
      }
      if(req.params.id.length === 0){
        res.status(400).send("Position ID is missing!");
      }
      Position.findOne(
          {_id: req.params.id}, function (err, position) {
            if (err){
              return res.status(500).send("There was a problem finding the positions.");
            }else{
              return res.status(200).send(position);
            }
          });

});

// Update POSITION: done
    router.put('/:id', VerifyToken, function (req, res, next) {
        if(!req.body){
          res.status(400).send("Request body is missing!");
        }
          if(!req.params.id){
            res.status(400).send("Position ID is missing!");
          }
          if(req.params.id.length === 0){
            res.status(400).send("Position ID is missing!");
          }
          if(!req.body.position_name){
            res.status(400).send("Position name is missing!");
          }
          if(req.body.position_name.length === 0){
            res.status(400).send("Position name is missing!");
          }
          if(!req.body.position_desc){
            res.status(400).send("Position description is missing!");
          }
          if(req.body.position_desc.length === 0){
            res.status(400).send("Position description is missing!");
          }
          if(!req.body.position_capacity){
            res.status(400).send("Position capacity is missing!");
          }
          if(req.body.position_capacity.length === 0){
            res.status(400).send("Position capacity is missing!");
          }
          Position.updateOne({"_id":req.params.id}, {$set:{
                  position_name: req.body.position_name,
                  position_description: req.body.position_desc,
                  position_capacity: req.body.position_capacity
              }},
              function (err,result) {
                  if (err) return res.status(500).send("There was a problem updating the information in the database.");
                  res.status(200).send({status:'success'});
              });
        });


module.exports = router;
