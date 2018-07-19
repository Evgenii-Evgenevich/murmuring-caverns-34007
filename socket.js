const server = require('./server');

const io = require('socket.io')(server);

var numUsers = 0;

io.on('connection', function(socket) {
    var addedUser = false;

    socket.on('add user', function(username) {
        if (addedUser) return;

        socket.username = username;
        ++numUsers;
        addedUser = true;

        socket.broadcast.emit('user joined', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function() {
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
