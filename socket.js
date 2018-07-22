const server = require('./server');

const io = require('socket.io')(server);

var numUsers = 0;

const userRepository = require('./UserRepository');
const userController = require('./UserController');

io.on('connection', (socket) => {
    var addedUser = false;

    socket.on('add user', (username) => {
        if (addedUser) return;

        socket.username = username;
        ++numUsers;
        addedUser = true;

        socket.broadcast.emit('user joined', {
            username: socket.username
        });
    });

    socket.on('auth user'), (data) => {
        userRepository.findByUserIdAndServceAndName(data.user_id, data.service, data.name, (user) => {
            if (user) {
                switch (data.service) {
                    case 'temp':
                        return userController.temp.try_signin(socket.request, data.name, data.pass);

                    case 'facebook':
                        return userController.facebook.try_auth_facebook(socket.request, data.name, data.pass);

                    case 'google':
                        return userController.google.try_auth_google(socket.request, data.name, data.pass);
                }
            }
            else {
                switch (data.service) {
                    case 'temp':
                        return userController.temp.try_signup(socket.request, data.name, data.pass);

                    case 'facebook':
                        return userController.facebook.try_auth_facebook(socket.request, data.name, data.pass);

                    case 'google':
                        return userController.google.try_auth_google(socket.request, data.name, data.pass);
                }
            }
        });
    }

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username
            });
        }
    });
});


module.exports = { io, numUsers };
