var crypto = require('crypto');

function generate(length) {
    let result = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < length; ++i) {
        result += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return result;
}

function isValid(password) {
    if (password) {
        if (password.length >= 5) {
            return true;
        }
    }
    return false;
}

function hashPassword(password) {
    return crypto
        .createHash('md5')
        .update(crypto
            .createHash('md5')
            .update(password)
            .digest('hex')
        ).digest('hex');
}

function checkPassword(user, password) {
    return hashPassword(password) === user.pass;
}

module.exports = { hashPassword, checkPassword, generate, isValid };

