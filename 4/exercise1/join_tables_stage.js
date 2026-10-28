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
  console.log("Connected!");
  let sql = "CREATE TABLE IF NOT EXISTS customers (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), favorite_product INT)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("customer table created");
  });

    sql = "CREATE TABLE IF NOT EXISTS products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("products table created");
  });

  sql = "INSERT INTO customers (name, favorite_product) VALUES ?";
  let values = [
    ['John', 154],
    ['Peter', 154],
    ['Amy', 155],
    ['Hannah', null],
    ['Michael', null]
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });

  sql = "INSERT INTO products (id, name) VALUES ?";
  values = [
    [154, "Chocolate Heaven"],
    [155, "Tasty Lemons"],
    [156, "Vanilla Dreams"]
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });
});