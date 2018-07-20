const MongoClient = require('mongodb').MongoClient;

function db_connect(callback) {
    MongoClient.connect('mongodb://EE:suppass@localhost:27017/db', function(err, db) {
        //if (err) throw err;

        callback( db );

        db.close();
    });
}

module.exports = {
    db: db_connect,

    collection: function (name, callback) {
        db_connect((db) => {
            db.collection(name, function (err, result) {
                //if (err) throw err;

                callback( result );
            });
        });
    }

};



