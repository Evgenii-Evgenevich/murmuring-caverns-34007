const PORT = process.env.PORT || 5000;
const express = require('express');
const path = require('path');

const app = require('./app');
const server = require('./server');

const secret = require('./pass').generate(30);

const session = (require('express-session'))({
    key: 'user_sid',
    secret: secret,
    resave: false,
    saveUninitialized: false
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const passport = require('./passport');
const flash = require('connect-flash');
const logger = require('morgan');

app
    .use(logger('dev'))
    .use(express.static(path.join(__dirname, 'public')))
    .use(express.json())
    .use(session)
    .use(passport.initialize())
    .use(passport.session())
    .use(flash())
    .use('/', indexRouter)
    .use('/users', usersRouter)
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
;

const socket = require('./socket');

socket.io.use((socket, next) => {
    session(socket.request, socket.request.res, next);
});

const userRepository = require('./UserRepository');

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    userRepository.findByUserIdAndServceAndName(user.user_id, user.service, user.name, (deserializedUser) => {
        done(null, deserializedUser);
    });
})


server
    .listen(PORT, () => console.log(`Listening on ${PORT}`))
;
