const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_CONN_STRING;
const client = new MongoClient(uri);
async function connect() {
  try {
    client.db(process.env.MONGODB_DB_NAME);
  } catch (error) {
    await client.close();
  }
}
async function getDB() {
  return client.db(process.env.MONGODB_DB_NAME);
}
module.exports = { connect, getDB };
