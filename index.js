const PORT = process.env.PORT || 5000;
const express = require('express');
const path = require('path');

const app = require('./app');
const server = require('./server');

const secret = require('./pass').generate(15);

const session = require('express-session')({
    key: 'user_sid',
    secret: secret,
    resave: false,
    saveUninitialized: false
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app
    .use(express.static(path.join(__dirname, 'public')))
    .use(express.json())
    .use(session)
    .use('/', indexRouter)
    .use('/users', usersRouter)
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
;


server
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
;

