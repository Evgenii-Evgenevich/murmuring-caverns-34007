const PORT = process.env.PORT || 5000;

const GOOGLE_ID = process.env.PASSPORT_GOOGLE_ID || 'clientID';
const GOOGLE_SECRET = process.env.PASSPORT_GOOGLE_SECRET || 'clientSecret';
const GOOGLE_CALLBACK = 'https://murmuring-caverns-34007.herokuapp.com/auth/google/callback';

const FACEBOOK_ID = process.env.PASSPORT_FACEBOOK_ID || 'clientID';
const FACEBOOK_SECRET = process.env.PASSPORT_FACEBOOK_SECRET || 'clientSecret';
const FACEBOOK_CALLBACK = 'https://murmuring-caverns-34007.herokuapp.com/auth/facebook/callback';

const passport = require('passport');

const userController = require('./UserController');

const signinStrategy = new (require('passport-local').Strategy)({
		usernameField: 'name',
		passwordField: 'pass',
		passReqToCallback: true 
	},
	(req, name, pass, done) => {
		//process.nextTick(() => {
			return userController.temp.try_signin(req, name, pass, done);
		//});
	}
);


const signupStrategy = new (require('passport-local').Strategy)({
		usernameField: 'name',
		passwordField: 'pass',
		passReqToCallback: true 
	},
	(req, name, pass, done) => {
		//process.nextTick(() => {
			return userController.temp.try_signup(req, name, pass, done);
		//});
	}
);


const facebookStrategy = new (require('passport-facebook').Strategy)({
        clientID: FACEBOOK_ID, 
        clientSecret: FACEBOOK_SECRET, 
        callbackURL: FACEBOOK_CALLBACK,
        profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name',
        profileFields: ['id', 'name'] 
    },
	(req, token, refreshToken, profile, done) => {
		//process.nextTick(() => {
			return userController.facebook.try_auth_facebook(req, token, refreshToken, profile, done);
		//});
	}
);


const googleStrategy = new (require('passport-google-oauth').OAuth2Strategy)({
		clientID: GOOGLE_ID,
		clientSecret: GOOGLE_SECRET,
		callbackURL: GOOGLE_CALLBACK,
		passReqToCallback: true
	},
	(req, token, refreshToken, profile, done) => {
		//process.nextTick(() => {
			return userController.google.try_auth_google(req, token, refreshToken, profile, done);
		//});
	}
);

passport
    .use('signin-temp', signinStrategy)
    .use('signup-temp', signupStrategy)
    .use('auth-facebook', facebookStrategy)
    .use('auth-google', googleStrategy)
;


module.exports = passport;

