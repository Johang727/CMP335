#!/usr/bin/node

const express = require("express");
const Joi = require("joi");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");

/* DATABASE SETUP */
/* -------------- */


// Create the Database
let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "cmp",
});

con.connect(function(err) {
  if (err) throw err;
  con.query("CREATE DATABASE IF NOT EXISTS college_reg", function (err, result) {
    if (err) throw err;
  });
  con.query("USE college_reg"), function (err) { if (err) throw err;};
});


con.connect(function(err) {
  if (err) throw err;

  const sql = "CREATE TABLE IF NOT EXISTS students (id INT AUTO_INCREMENT PRIMARY KEY, lastname VARCHAR(255), firstname VARCHAR(255), emailaddr VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
});

/* APPLICATION FUNCTIONS */
/* --------------------- */

// allow JSON and CORS 
app.use(express.json());
app.use(cors());

// Validation for Students JOI Side
function validate_student(student) {
  const schema = Joi.object({
    lastname: Joi.string().required(),
    firstname: Joi.string().required(),
    emailaddr: Joi.string().required()
  }); 
  const result = schema.validate(student, { abortEarly: false });
  return result;
}

/* STUDENT ENDPOINTS */
/* ------------------ */

/* Returns all students */
app.get("/api/students", (req, res) => {
  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM students", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });
});

/* Returns specific student from :id */
app.get("/api/students/:id", (req, res) => {
  // check if exists
  con.connect(function(err) {
    if (err) throw err;
    const id = req.params.id;
    const sql = "SELECT * FROM students WHERE id = ?"
    con.query(sql, [id], function (err, result, fields) {
      if (err) res.status(404).send("The student with the given ID was not found.");
      res.send(result);
    });
  });
});

/* Adds a student, calling validate_student to verifiy before adding */
app.post("/api/students", (req, res) => {
  // check if valid
  const { error } = validate_student(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const lastname = req.body.lastname;
  const firstname = req.body.firstname;
  const emailaddr = req.body.emailaddr;


  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("INSERT INTO students (lastname, firstname, emailaddr) VALUES (?, ?, ?)", [lastname, firstname, emailaddr], function (err, result) {
      if (err) throw err;
      res.send(`student ID: ${result.insertId}`)
    });
  });



});

/* TODO: Update a student's entry with an :id */
app.put("/api/students/:id", (req, res) => {
  res.status(500).send("Not yet implemented.");
});

/* TODO: Delete a student's entry with an :id */
app.delete("/api/students/:id", (req, res) => {
  res.status(500).send("Not yet implemented.");
});




const port = process.env.PORT || 3002; // listens on 3002 because 3000 was causing conflicts with VSC
app.listen(port, () => console.log(`Listening on port ${port}....`));
