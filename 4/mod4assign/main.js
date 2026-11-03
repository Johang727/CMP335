#!/usr/bin/node

const express = require("express");
const Joi = require("joi");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cmp",
});

await con.connect(function(err) {
  if (err) throw err;
  con.query("CREATE DATABASE customer_relations IF NOT EXISTS", function (err, result) {
    if (err) throw err;
    console.log("Database created!");
  });
  con.close();
});

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cmp",
  database: "customer_relations"
});


await con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  let sql = "CREATE TABLE customers (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255)) IF NOT EXISTS";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});


app.use(express.json());
app.use(cors());

function validate_customer(customer) {
  const schema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required()
  });
  const result = schema.validate(customer, { abortEarly: false });
  return result;
}


app.get("/", (req, res) => {
  res.status(300).redirect("/api/customers");
});

app.get("/api/customers", (req, res) => {
  await con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM customers", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
    con.close();
  });
});

app.get("/api/customers/:id", (req, res) => {
  // check if exists
  await con.connect(function(err) {
    if (err) throw err;
    const id = req.params.id;
    const sql = "SELECT * FROM customers WHERE id = ?"
    con.query(sql, [id], function (err, result, fields) {
      if (err) res.status(404).send("The customer with the given ID was not found.");
    return;
      res.send(result);
    });
    con.close();
  });
});

app.post("/api/customers", (req, res) => {
  // check if valid
  const { error } = validate_customer(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const name = req.body.name;
  const address = req.body.address;


  await con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    let sql = `INSERT INTO customers (name, address) VALUES ('${name}', '${address}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.send("1 record inserted");
    });
    con.close();
  });



});

app.put("/api/customers/:id", (req, res) => {
  res.status(500).send("Not yet implemented.");
});

app.delete("/api/customers/:id", (req, res) => {
  res.status(500).send("Not yet implemented.");
});

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port}....`));
