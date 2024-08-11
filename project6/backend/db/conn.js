const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.ATLAS_URI;

let _db;
let client;

module.exports = {
    connectToServer: function(callback) {
        console.log("Attempting to connect...");
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        async function run() {
            try {
                await client.connect();
                await client.db("admin").command({ ping: 1 });
                console.log("Pinged your deployment. You successfully connected to MongoDB!");
                _db = client.db('bank');
                console.log('Connected to bank collection');
                callback();
            } catch (err) {
                console.error(err);
                callback(err);
            }
        }
        run().catch(console.dir);
    },

    getDb: function() {
        return _db;
    },

    closeConnection: async function() {
        if (client) {
            await client.close();
            console.log('Database connection closed');
        }
    }
};