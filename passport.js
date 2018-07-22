const server = require('./server');

const GOOGLE_ID = process.env.PASSPORT_GOOGLE_ID || 'clientID';
const GOOGLE_SECRET = process.env.PASSPORT_GOOGLE_SECRET || 'clientSecret';
const GOOGLE_CALLBACK = server.address().address + ':' server.address().port + '/auth/google/callback';

const FACEBOOK_ID = process.env.PASSPORT_FACEBOOK_ID || 'clientID';
const FACEBOOK_SECRET = process.env.PASSPORT_FACEBOOK_SECRET || 'clientSecret';
const FACEBOOK_CALLBACK = server.address().address + ':' server.address().port + '/auth/facebook/callback';

const host = server.address().address;
const port = server.address().port;

const passport = require('passport');

const userController = require('./UserController');

const signinStrategy = new (require('passport-local').Strategy)({
    usernameField: 'name',
    passwordField: 'pass',
    passReqToCallback: true 
},
    userController.temp.try_signin
);


const signupStrategy = new (require('passport-local').Strategy)({
    usernameField: 'name',
    passwordField: 'pass',
    passReqToCallback: true 
},
    userController.temp.try_signup
);


const facebookStrategy = new (require('passport-facebook').Strategy)({
        clientID: FACEBOOK_ID, 
        clientSecret: FACEBOOK_SECRET, 
        callbackURL: FACEBOOK_CALLBACK,
        profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name',
        profileFields: ['id', 'name'] 
    },
    userController.facebook.try_auth_facebook
);


const googleStrategy = new (require('passport-google-oauth').OAuth2Strategy)({
    clientID: GOOGLE_ID,
    clientSecret: GOOGLE_SECRET,
    callbackURL: GOOGLE_CALLBACK,
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

