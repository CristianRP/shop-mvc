const { MongoClient } = require('mongodb')

let _db;

const mongoConnect = callback => {
  MongoClient.connect('mongodb+srv://cristianramirezgt:291fWV8RTsNeQPtc@clusternodejs.u8wma2f.mongodb.net/shop?retryWrites=true&w=majority&appName=ClusterNodeJS')
    .then(client => {
      console.log('Connected');
      _db = client.db()
      callback();
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
