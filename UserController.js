const userRepository = require('./UserRepository');

const socket = require('./socket');

const User = require('./User');
const pass = require('./pass');

function temp_save_unique(req) {
    let user_id = pass.generate(30);

    userRepository.findByUserId(user_id, function (user) {
        if (user) {
            temp_save_unique(req.body.username, req.body.password, req)
        } else {
            userRepository.save(new User(user_id, pass.hashPassword(req.body.password), 'temp', req.body.username));

            req.session.authenticated = true;
            req.session.user_id = user_id;
            req.session.username = req.body.username;
            req.session.auth_service = 'temp';
            socket.io.emit('add user', req.body.username);
        }
    });
}

function try_signin(req, name, pass, done) {
    userRepository.findByName(name, function (user) {
        if (!user) {
            return done(null, false, req.flash('signinMessage', 'Invalid Name'));
        } else {
            if (!pass.checkPassword(user, pass)) {
                return done(null, false, req.flash('signinMessage', 'Invalid Password'));
            }
            else {
                req.session.authenticated = true;
                req.session.user_id = user.user_id;
                req.session.auth_service = user.service;
                req.session.username = user.name;
                socket.io.emit('add user', user.name);
                return done(null, true);
            }
        }
    });
}

function try_signup(req, name, pass, done) {
    userRepository.findByName(name, function (user) {
        if (user) {
            return done(null, false, req.flash('signupMessage', 'Name is already taken'));
        } else {
            if (!pass.isValid(req.body.password))  {
                return done(null, false, req.flash('signupMessage', 'Invalid Password'));
            }
            else {
                temp_save_unique(req);
                return done(null, true);
            }
        }
    });
}

function try_auth_facebook(req, token, refreshToken, profile, done) {
    let user_id = profile.id;

    userRepository.findByUserId(user_id, function (user) {
        let service = 'facebook';
        let username = profile.name.givenName + ' ' + profile.name.familyName;

        if (!user) {
            userRepository.save(new User(user_id, token, service, username));
        }

        req.session.authenticated = true;
        req.session.user_id = user_id;
        req.session.username = username;
        req.session.auth_service = service;
        req.session.fbtoken = token;
        socket.io.emit('add user', req.body.username);

        return done(null, true);
    });
}

function try_auth_google(req, token, refreshToken, profile, done) {
    let user_id = profile.id;

    userRepository.findByUserId(user_id, function (user) {
        let service = 'google';
        let username = profile.displayName;

        if (!user) {
            userRepository.save(new User(user_id, token, service, username));
        }

        req.session.authenticated = true;
        req.session.user_id = user_id;
        req.session.username = username;
        req.session.auth_service = service;
        req.session.fbtoken = token;
        socket.io.emit('add user', req.body.username);

        return done(null, true);
    });
}
module.exports = {
    temp: {  try_signin, try_signup },
    facebook: { try_auth_facebook },
    google: { try_auth_google }
};


