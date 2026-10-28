#!/usr/bin/node
let mysql = require("mysql2");

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cmp",
  database: "customer_relations"
});

let name = 'Amy';
let adr = 'Mountain 21';
let sql = 'SELECT * FROM customers WHERE name = ? OR address = ?';
con.query(sql, [name, adr], function (err, result) {
  if (err) throw err;
  console.log(result);
});