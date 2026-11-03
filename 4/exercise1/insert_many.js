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
  let sql = "INSERT INTO customers (name, address, priority) VALUES ?";
  let values = [
    ['John', 'Highway 71', 1],
    ['Peter', 'Lowstreet 4', 2],
    ['Amy', 'Apple ST 652', 5],
    ['Hannah', 'Mountain 21', 10],
    ['Michael', 'Valley 345', 0],
    ['Sandy', 'Ocean BLVD 2', -1200],
    ['Betty', 'Green Grass 1', 2],
    ['Richard', 'Sky ST 331', 0],
    ['Susan', 'One Way 98', 2],
    ['Vicky', 'Yellow Garden 2', 1],
    ['Ben', 'Park Lane 38', 3],
    ['William', 'Central ST 954', 10],
    ['Chuck', 'Main Road 989', 2],
    ['Viola', 'Sideway 1633', 1]
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });
});