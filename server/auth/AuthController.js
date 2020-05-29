let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let config = require('../config');
let VerifyToken = require('./VerifyToken');
let User = require('../user/User');

router.post('/add-user', function(req, res) {

  if(!req.body){
    res.status(400).send("Request body is missing!");
  }
  if(!req.body.user_username || !req.body.user_password){
    res.status(400).send("Username or password is missing!");
  }
  if(req.body.user_username.length === 0 || req.body.user_password.length === 0){
    res.status(400).send("Username or password is missing!");
  }
  if(!req.body.user_firstname || !req.body.user_lastname){
    res.status(400).send("Firstname or lastname is missing!");
  }
  if(req.body.user_firstname.length === 0 || req.body.user_lastname.length === 0){
    res.status(400).send("Firstname or lastname is missing!");
  }
  let hashedPassword = bcrypt.hashSync(req.body.user_password, 8);
  User.create({
    user_firstname: req.body.user_firstname,
    user_lastname: req.body.user_lastname,
    user_username : req.body.user_username,
    user_password : hashedPassword
  },
  function (err, user) {
    if (err) return res.status(500).send("There was a problem registering the user.")

    console.log('created');
    res.status(200).send({user_id: user._id, user_username: user.user_username, user_firstname: user.user_firstname, user_lastname: user.user_lastname, status: 'success'});
  });
});

router.put('/:id', VerifyToken, function (req, res, next) {
    if(!req.body){
      res.status(400).send("Request body is missing!");
    }
    if(!req.body.user_username){
      res.status(400).send("Username is missing!");
    }
    if(req.body.user_username.length === 0){
      res.status(400).send("Username is missing!");
    }
    if(!req.body.user_firstname || !req.body.user_lastname){
      res.status(400).send("Firstname or lastname is missing!");
    }
    if(req.body.user_firstname.length === 0 || req.body.user_lastname.length === 0){
      res.status(400).send("Firstname or lastname is missing!");
    }
    if(req.body.user_password){
      if(req.body.user_password.length != 0){
        User.updateOne({"_id":req.params.id}, {$set:{
                user_username: req.body.user_username ,
                user_firstname: req.body.user_firstname,
                user_lastname: req.body.user_lastname,
                user_password: req.body.user_password
            }},
            function (err, result) {
                if (err) return res.status(500).send("There was a problem updating the information in the database.");
                res.status(200).send({status:'success'});
            });
          }else{
            User.updateOne({"_id":req.params.id}, {$set:{
                    user_username: req.body.user_username ,
                    user_firstname: req.body.user_firstname,
                    user_lastname: req.body.user_lastname
                }},
                function (err, result) {
                    if (err) return res.status(500).send("There was a problem updating the information in the database.");
                    res.status(200).send({status:'success'});
                });
          }
      }else{
        User.updateOne({"_id":req.params.id}, {$set:{
                user_username: req.body.user_username ,
                user_firstname: req.body.user_firstname,
                user_lastname: req.body.user_lastname
            }},
            function (err, result) {
                if (err) return res.status(500).send("There was a problem updating the information in the database.");
                res.status(200).send({status:'success'});
            });
        }
  });

router.post('/login', function(req, res) {
  if(!req.body){
    res.status(400).send("Request body is missing!");
  }
  if(!req.body.user_username || !req.body.user_password){
    res.status(400).send("Email or password is missing!");
  }
  if(req.body.user_username.length === 0 || req.body.user_password.length === 0){
    res.status(400).send("Email or password is missing!");
  }
  User.findOne({ user_username: req.body.user_username }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    var passwordIsValid = bcrypt.compareSync(req.body.user_password, user.user_password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    var token = jwt.sign({ id: user._id }, config.auth, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({user_id: user._id, user_username: user.user_username, user_firstname: user.user_firstname, user_lastname: user.user_lastname, user_token: token, auth: true });
  });

});


module.exports = router;
