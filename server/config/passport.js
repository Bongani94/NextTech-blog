const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

/*module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match User
            User.findOne({ email: email })
                .then(user => {
                    if(!user) {
                        return done(null, false, { message: 'That email is not registered' });
                    }

                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password incorrect'})
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}*/


module.exports = function(passport) { 
    passport.use( 
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            // Match User 
            try {  
                const user = await User.findOne({ email: email }); 
                if(!user) { 
                    return done(null, false, { message: 'That email is not registered' }); 
                }
                
                // Match password
                const isMatch = await bcrypt.compare(password, user.password);
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect'})
                }
            } catch (err) {
                console.log(err);
                return done(err);
            }
        })
        );
        
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });
        
        passport.deserializeUser(async (id, done) => {
            try {
                
                const user = await User.findById(id);
                done(null, user);
            } catch (err) {
                done(err);
            }
        });
    }