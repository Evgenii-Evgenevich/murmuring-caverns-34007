const userRepository = require('./UserRepository');

const socket = require('./socket');

const User = require('./User');
const password = require('./pass');

function temp_save(req, name, pass) {
    userRepository.save(new User(0, password.hashPassword(pass), 'temp', name));

    req.session.authenticated = true;
    req.session.user_id = user_id;
    req.session.username = req.body.username;
    req.session.auth_service = 'temp';
    socket.io.emit('add user', name);
}

function try_signin(req, name, pass, done) {
    let user_id = 0;
    let service = 'temp';

    userRepository.findByUserIdAndServceAndName(0, service, name, function (user) {
        if (!user) {
            return done(null, false, req.flash('signinMessage', 'Invalid Name'));
        } else {
            if (!password.checkPassword(user, pass)) {
                return done(null, false, req.flash('signinMessage', 'Invalid Password'));
            }
            else {
                req.session.authenticated = true;
                req.session.user_id = user.user_id;
                req.session.auth_service = user.service;
                req.session.username = user.name;
                socket.io.emit('add user', user.name);

                return done(null, { user_id, name, service });
            }
        }
    });
}

function try_signup(req, name, pass, done) {
    let user_id = 0;
    let service = 'temp';

    userRepository.findByUserIdAndServceAndName(user_id, service, name, function (user) {
        if (user) {
            return done(null, false, req.flash('signupMessage', 'Name is already taken'));
        } else {
            if (!password.isValid(pass)) {
                return done(null, false, req.flash('signupMessage', 'Invalid Password'));
            }
            else {
                temp_save(req, name, pass);
                return done(null, { user_id, name, service });
            }
        }
    });
}

function try_auth_facebook(req, token, refreshToken, profile, done) {
    let user_id = profile.id;
    let service = 'facebook';
    let name = profile.name.givenName + ' ' + profile.name.familyName;

    userRepository.findByUserIdAndServceAndName(0, service, name, function (user) {

        if (!user) {
            userRepository.save(new User(user_id, token, service, name));
        }

        req.session.authenticated = true;
        req.session.user_id = user_id;
        req.session.username = name;
        req.session.auth_service = service;
        req.session.token = token;
        socket.io.emit('add user', name);

        return done(null, { user_id, name, service });
    });
}

function try_auth_google(req, token, refreshToken, profile, done) {
    let user_id = profile.id;
    let service = 'google';
    let name = profile.displayName;

    userRepository.findByUserIdAndServceAndName(0, service, name, function (user) {

        if (!user) {
            userRepository.save(new User(user_id, token, service, name));
        }

        req.session.authenticated = true;
        req.session.user_id = user_id;
        req.session.username = name;
        req.session.auth_service = service;
        req.session.token = token;
        socket.io.emit('add user', name);

        return done(null, { user_id, name, service });
    });
}

function add_user(req, res) {
    req.session.authenticated = true;
    req.session.user_id = req.user.user_id;
    req.session.username = req.user.username;
    req.session.auth_service = req.user.service;
    req.session.token = req.user.token;
    socket.io.emit('add user', req.user.username);
    res.redirect('/');
}

function sign_up(user_id, pass, service, name) {
}

function sign_in(user_id, pass, service, name) {
}

function sign_in(req, user_id, pass, service, name) {
    userRepository.findByUserIdAndServceAndName(data.user_id, data.service, data.name, (user) => {
        if (user) {
            switch (data.service) {
                case 'temp':
                    {
                        if (!password.checkPassword(user, pass)) {
                            req.flash('signinMessage', 'Invalid Password');
                        }
                        else {
                            req.user = { user_id, name, service };
                            req.session.authenticated = true;
                            req.session.user_id = user.user_id;
                            req.session.auth_service = user.service;
                            req.session.username = user.name;
                            socket.io.emit('add user', user.name);
                        }
                    }
                    break;

                case 'facebook':
                    break;

                case 'google':
                    break;
            }
        }
        else {
            switch (data.service) {
                case 'temp':
                    {
                        if (!password.isValid(pass)) {
                            req.flash('signupMessage', 'Invalid Password');
                        }
                        else {
                            req.user = { user_id, name, service };
                            temp_save(req, name, pass);
                        }
                    }
                    break;

                case 'facebook':
                    break;

                case 'google':
                    break;
            }
        }
    });
}

module.exports = {
    temp: { try_signin, try_signup },
    facebook: { try_auth_facebook },
    google: { try_auth_google },
    add_user: add_user
};


