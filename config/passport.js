const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy ({ usernameField: 'email' }, (email, password, done) => {
            // Match User
            User.findOne({email: email})   
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'That email is not registered!'});
                    }

                    // Means user exists, now match the password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err)
                            console.log("Error in Passport.js man");

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done (null, false, { message: 'Incorrect Password!'});
                        }
                    });
                })
                .catch(err => console.log(err)); 
        })
    );
    
    passport.serializeUser( (user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser( (id, done) => {
        User.findById(id,(err, user) => {
          done(err, user);
        });
    });

}