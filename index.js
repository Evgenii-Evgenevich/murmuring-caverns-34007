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

app
    .use(express.static(path.join(__dirname, 'public')))
    .use(express.json())
    .use(session)
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
;


server
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
;

