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
  let sql = "SELECT customers.name AS customer, products.name AS favorite FROM customers LEFT JOIN products ON customers.favorite_product = products.id";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});