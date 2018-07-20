const express = require('express');
const router = express.Router();

var socket = require('../socket');

/* GET users listing. */
router.get('/',
    (req, res, next) => {
        res.send('the number of online users: ' + socket.numUsers);
    }
);

module.exports = router;
