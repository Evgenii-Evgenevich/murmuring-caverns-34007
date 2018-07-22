const express = require('express');
const router = express.Router();

const passport = require('../passport');
const password = require('../pass');

router
    .get('/',
        (req, res, next) => {
            res.render('index', { session: req.session, locals: { home:true } });
        }
    )
    .get('/signout',
        (req, res, next) => {
            req.session.authenticated = false;
            req.session.reset();
            res.redirect('/');
        }
    )
    .get('/signin/temp',
        (req, res, next) => {
            res.render('index', { session: req.session, locals: { signin:true, message:req.flash('signinMessage') } });
        }
    )
    .post('/signin/temp/callback',
        passport.authenticate('signin-temp', {
            successRedirect : '/',
            failureRedirect : '/signin/temp',
            failureFlash : true
        })
    )
    .get('/signup/temp',
        (req, res, next) => {
            res.render('index', { session: req.session, locals: { signup:true, gpass:password.generate(9), message:req.flash('signupMessage') } });
        }
    )
    .post('/signup/temp/callback',
        passport.authenticate('signup-temp', {
            successRedirect : '/',
            failureRedirect : '/signup/temp',
            failureFlash : true
        })
    )
    .get('/auth/facebook',
        passport.authenticate('auth-facebook', {
            scope : ['public_profile']
        })
    )
    .get('/auth/facebook/callback',
        passport.authenticate('auth-facebook', {
            successRedirect : '/',
            failureRedirect : '/',
        })
    )
    .get('/auth/google',
        passport.authenticate('auth-google', {
            scope : ['profile']
        })
    )
    .get('/auth/google/callback',
        passport.authenticate('auth-google', {
            successRedirect : '/',
            failureRedirect : '/',
        }),
        (req, res) => {
            req.session.token = req.user.token;
            res.redirect('/');
        }
    )
;

module.exports = router;
