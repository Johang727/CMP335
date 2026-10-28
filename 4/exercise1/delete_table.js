#!/usr/bin/node
let mysql = require("mysql2");

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cmp",
  database: "customer_relations"
});

con.connect(function(err) {
  if (err) throw err;
  let sql = "DROP TABLE IF EXISTS customers";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});