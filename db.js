const URL = process.env.MONGODB_URI || 'mongodb://EE:suppass@localhost:27017/db';
const MongoClient = require('mongodb').MongoClient;

var dbo;

MongoClient.connect(URL,
    { useNewUrlParser: true },
    (err, client) => {
        if (err) {
            process.stdout.write('\n==========================err==========================\n');
            process.stdout.write(err);
            process.stdout.write('\n==========================err==========================\n');
            throw err;
            return null;
        }
        process.stdout.write('\n==========================url==========================\n');
        process.stdout.write(URL);
        process.stdout.write('\n==========================url==========================\n');

        dbo = client.db();
    }
);

module.exports = {
    db: dbo,

    collection: function (name, callback) {
        dbo.collection(name, function (err, result) {
            if (err) {
                process.stdout.write('\n==========================err==========================\n');
                process.stdout.write(err);
                process.stdout.write('\n==========================err==========================\n');
                throw err;
                return null;
            }

            callback(result);
        });
    }
};



