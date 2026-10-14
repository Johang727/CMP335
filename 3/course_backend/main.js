#!/usr/bin/node

const express = require("express");
const Joi = require("joi");

const app = express();

app.use(express.json());

function validate_course(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    const result = schema.validate(course, { abortEarly: false });
    return result;
};




const courses = [
    {id: 1, name: "Course 1"},
    {id: 2, name: "Course 2"},
    {id: 2, name: "Course 3"}
];

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
    // check if exists
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("The course with the given ID was not found.");
        return;
    };

    res.send(course);
});

app.post("/api/courses", (req, res) => {
    // check if exists
    const {error} = validate_course(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    };

    const course = {
        id: courses.length + 1, 
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
    // check if exists
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("The course with the given ID was not found.");
        return;
    };

    const {error} = validate_course(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    };

    course.name = req.body.name;
    res.send(course);

});

app.delete("/api/courses/:id", (req, res) => {
    // check if exists
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) {
        res.status(404).send("The course with the given ID was not found.");
        return;
    };

    const idx = courses.indexOf(course);
    courses.splice(idx, 1);

    res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}....`));