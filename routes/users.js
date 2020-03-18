const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');

// Bring in User Model
let User = require('../models/user');

// Register Form
router.get('/register', function(req, res) {
  res.send('register');
});

// Register Process
router.post('/register', [
    // no values can be empty
    check('nickname', 'Nickname is required').notEmpty(),
    check('email', 'Email is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
    check('password2', 'Repeat Password is required').notEmpty(),
    // nickname can not be longer than 15 characters
    check('nickname', 'Nickname must be 15 or less characters').isLength({max: 15}),
    // email must be valid
    check('email', 'Email is invalid').isEmail(),
    // email must not exist
    check('email', "Email is already being used")
      .custom((value, {req}) => {
          return new Promise((resolve, reject) => {
            var query = User.find({email: req.body.email});
            query.exec(function(err, docs){
              if(err) {
                reject(new Error('Server Error'));
              }
        
              if(docs.length > 0) {
                reject(new Error('E-mail already in use'));
              }
        
              resolve(true);
        
            });
      
          });
      }),
    // password must be valid
    check('password')
      .isLength({min:8})
      .withMessage("Password must be at least 8 characters long"),
    // passwords must match
    check('password2', "Passwords do not match").custom((value, { req }) => value === req.body.password),
  ], (req, res) => {
  
    let errors = validationResult(req);
    
    if(!errors.isEmpty()){
      return res.status(422).json({ errors: errors.array() });
    }
    else {
      let newUser = new User({
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password
      });
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash) {
          if(err){
            console.log(err);
          }
          newUser.password = hash;
          newUser.save(function(err){
            if(err){
              return;
            }
            else {
              res.redirect('/');
            }
          });
        });
      });
  }
  
});

module.exports = router;