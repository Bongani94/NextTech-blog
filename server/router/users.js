const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');
const Post = require('../models/Post');

// View page
const usersLayout = '../views/layouts/users';

// Login Page
router.get('/login', async (req, res) => {
   try {
    const locals = {
        title: "Login",
        description: ""
    }

    res.render('users/login', {
        layout: usersLayout,
        locals
    })
   }
   catch (err) {
    console.log(err)
   }
});

// Register Page
router.get('/register', (req, res) => {
    try {
        const locals = {
            title: "Register",
            description: ""
        }
    
        res.render('users/register', {
            layout: usersLayout,
            locals
        })
    }
    catch (err) {
        console.log(err)
    }
});

// Register Handler
router.post('/register', (req, res) => {

    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields'});
    }

    // Check passwords match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match' })
    }

    // Check pass length
    if(password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if(errors.length > 0) {
        res.render('users/register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if(user) {
                    // User exists
                    errors.push({ msg: 'Email is already registered' })
                    res.render('users/register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            // Set password to hashed
                            newUser.password = hash;
                            // Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can login')
                                    res.redirect('/login')
                                })
                                .catch(err => console.log(err));
                        }))

                }
            })
    }
});

// Login Handle
/*router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
})*/

router.post('/login', async (req, res, next) => { 
    try { 
        await passport.authenticate('local', { 
            successRedirect: '/dashboard', 
            failureRedirect: '/login', 
            failureFlash: true 
        })(req, res, next); 
    } catch (error) { 
        next(error); } 
    })



module.exports = router;