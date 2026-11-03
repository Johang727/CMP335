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

con.connect(function(err) {
  if (err) throw err;
  con.query("CREATE DATABASE IF NOT EXISTS customer_relations", function (err, result) {
    if (err) throw err;
  });
});

con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cmp",
  database: "customer_relations"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  let sql = "CREATE TABLE IF NOT EXISTS customers (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255), priority INT)";
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
});


app.use(express.json());
app.use(cors());

function validate_customer(customer) {
  const schema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    priority: Joi.number().required()
  });
  const result = schema.validate(customer, { abortEarly: false });
  return result;
}


app.get("/", (req, res) => {
  res.status(300).redirect("/api/customers");
});

app.get("/api/customers", (req, res) => {
  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM customers", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
});

app.get("/api/customers/:id", (req, res) => {
  // check if exists
  con.connect(function(err) {
    if (err) throw err;
    const id = req.params.id;
    const sql = "SELECT * FROM customers WHERE id = ?"
    con.query(sql, [id], function (err, result, fields) {
      if (err) res.status(404).send("The customer with the given ID was not found.");
      res.send(result);
    });
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
  const priority = req.body.priority;


  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("INSERT INTO customers (name, address, priority) VALUES (?, ?, ?)", [name, address, priority], function (err, result) {
      if (err) throw err;
      res.send(`Customer ID: ${result.insertId}`)
    });
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
