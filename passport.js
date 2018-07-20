const passport = require('passport');

const userController = require('./UserController');

const signinStrategy = new require('passport-local').Strategy({
        usernameField: 'name',
        passwordField: 'pass',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    userController.temp.try_signin
);


const signupStrategy = new require('passport-local').Strategy({
        usernameField: 'name',
        passwordField: 'pass',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    userController.temp.try_signup
);


const facebookStrategy = new require('passport-facebook').Strategy({
        clientID: 'clientID', // your App ID
        clientSecret: 'clientSecret', // your App Secret
        callbackURL: 'http://localhost:5000/auth/facebook/callback',
        profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name',
        profileFields: ['id', 'name'] // For requesting permissions from Facebook API
    },
    userController.facebook.try_auth_facebook
);


const googleStrategy = new require('passport-google-auth').Strategy({
    clientID: 'clientID',
    clientSecret: 'clientSecret',
    callbackURL: 'http://localhost:5000/auth/google/callback',
    passReqToCallback: true
    },
     userController.google.try_auth_google
);



passport
    .use('signin-temp', signinStrategy)
    .use('signup-temp', signupStrategy)
    .use('auth-facebook', facebookStrategy)
    .use('auth-google', googleStrategy)
;


module.exports = passport;

