var User = require('./User');

var db = require('./db');

var user_collection = function (callback) {
    db.collection('user_collection', callback);
};

module.exports = {
    findAll: function(callback) {
        user_collection(function (collection) {
            collection.find().toArray(function (err, res) {
                if (err) throw err;

                callback(res);
            });
        });
    },

    findById: function(id, callback) {
        user_collection(function (collection) {
            collection.findOne( { _id: collection.db.bson_serializer.ObjectID.createFromHexString(id) },
                function (err, res) {
                    if (err) throw err;

                    callback(res);
                }
            );
        });
    },

    findByUserId: function (user_id, callback) {
        user_collection(function (collection) {
            collection.findOne( { user_id: user_id },
                function (err, res) {
                    if (err) throw err;

                    callback(res);
                }
            );
        });
    },

    findByName: function (name, callback) {
        user_collection(function (collection) {
            collection.findOne( { name: name },
                function (err, res) {
                    if (err) throw err;

                    callback(res);
                }
            );
        });
    },

    findByUserIdAndServceAndName: function (user_id, service, name, callback) {
        user_collection(function (collection) {
            collection.findOne({ user_id: user_id, service: service, name: name },
                function (err, res) {
                    if (err) throw err;

                    callback(res);
                }
            );
        });
    },

    save: function(user) {
        if (!(user instanceof User)) {
            process.stdout.write('oops');
        }

        user_collection(function (collection) {
            collection.insertOne(user);
        });
    },

    delete: function(id) {
        user_collection(function (collection) {
            collection.removeOne( { _id: collection.db.bson_serializer.ObjectID.createFromHexString(id) } );
        });
    }

};
