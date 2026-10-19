#!/usr/bin/node

const express = require("express");
const Joi = require("joi");

const app = express();

app.use(express.json());

function validate_item(item) {
    const schema = Joi.object({
        name: Joi.string().required(),
        desc: Joi.string(),
        due_date: Joi.date().required(),
        priority: Joi.number().required(),
        completed: Joi.bool().required()
    });
    const result = schema.validate(item, { abortEarly: false });
    return result;
};

const items = [
    {
        id: 1, 
        name: "CMP 335: Todo List Backend",
        desc: "Backend for the todo list. https://canvas.doane.edu/courses/23610/assignments/402685",
        due_date: "10/16/2026",
        priority: 5,
        completed: false
    },
    {
        id: 2, 
        name: "CMP 210: Discussion Board",
        desc: "Discussion Board Assignment.",
        due_date: "10/16/2026",
        priority: 4,
        completed: true
    },
    {
        id: 3, 
        name: "Eat Lunch",
        desc: "Required to not die of starvation (does not prevent other deaths).",
        due_date: "10/16/2026",
        priority: -30,
        completed: false
    },
];

app.get("/", (req, res) => {
    res.status(300).redirect("/api/items");
});

app.get("/api/items", (req, res) => {
    res.send(items);
});

app.get("/api/items/:id", (req, res) => {
    // check if exists
    const item = items.find(c => c.id === parseInt(req.params.id));
    if (!item) {
        res.status(404).send("The item with the given ID was not found.");
        return;
    };

    res.send(item);
});

app.post("/api/items", (req, res) => {
    // check if exists
    const {error} = validate_item(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    };



    const item = {
        id: items[items.length-1].id + 1, 
        name: req.body.name,
        desc: req.body.desc,
        due_date: req.body.due_date,
        priority: req.body.priority,
        completed: req.body.completed
    };

    items.push(item);
    res.send(item);
});

app.put("/api/items/:id", (req, res) => {
    // check if exists
    const item = items.find(c => c.id === parseInt(req.params.id));
    if (!item) {
        res.status(404).send("The item with the given ID was not found.");
        return;
    };

    const {error} = validate_item(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    };

    item.name = req.body.name;
    item.desc = req.body.desc;
    item.due_date = req.body.due_date;
    item.priority = req.body.priority;
    item.completed = req.body.completed;

    res.send(item);

});

app.delete("/api/items/:id", (req, res) => {
    // check if exists
    const item = items.find(c => c.id === parseInt(req.params.id));

    if (!item) {
        res.status(404).send("The item with the given ID was not found.");
        return;
    };

    const idx = items.indexOf(item);
    items.splice(idx, 1);

    res.send(item);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}....`));