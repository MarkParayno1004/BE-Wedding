const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "weddingDB",
  password: "123",
  port: 9000,
});
client.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = client;
