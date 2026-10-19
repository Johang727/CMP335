#!/usr/bin/node

const express = require("express");
const Joi = require("joi");

const app = express();

app.use(express.json());

function validate_distro(distro) {
    const schema = Joi.object({
        name: Joi.string().required(),
        desc: Joi.string().min(5).required(),
        url: Joi.string().required()
    });
    const result = schema.validate(distro, { abortEarly: false });
    return result;
};

const distros = [
    {
        id: 1, 
        name: "Suicide Linux",
        desc: "If a command does not exist, interpret as \"sudo rm -rf / --no-preserve-root\". Based on Debian.",
        url: "https://qntm.org/suicide"
    },
    {
        id: 2, 
        name: "AmogOS",
        desc: "A very serious OS based on Among Us. Based on RPi OS & Debian.",
        url: "https://github.com/Amog-OS/AmogOS"
    },
    {
        id: 3, 
        name: "Hannah Montana Linux Modern",
        desc: "A modern remaster of the original Hannah Montana Linux based on Debian.",
        url: "https://gitlab.com/DecaCagle/hannahmontanalinux26"
    },
    {
        id: 4, 
        name: "Rebecca Black OS",
        desc: "An OS based on Debian and one of the earliest distros to use Wayland.",
        url: "https://distrowatch.com/table.php?distribution=rebeccablackos"
    },
];

app.get("/", (req, res) => {
    res.status(300).redirect("/api/distros");
});

app.get("/api/distros", (req, res) => {
    res.send(distros);
});

app.get("/api/distros/:id", (req, res) => {
    // check if exists
    const distro = distros.find(c => c.id === parseInt(req.params.id));
    if (!distro) {
        res.status(404).send("The distro with the given ID was not found.");
        return;
    };

    res.send(distro);
});

app.post("/api/distros", (req, res) => {
    // check if exists
    const {error} = validate_distro(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    };

    const distro = {
        id: distros.length + 1, 
        name: req.body.name,
        desc: req.body.desc,
        url: req.body.url
    };

    distros.push(distro);
    res.send(distro);
});

app.put("/api/distros/:id", (req, res) => {
    // check if exists
    const distro = distros.find(c => c.id === parseInt(req.params.id));
    if (!distro) {
        res.status(404).send("The distro with the given ID was not found.");
        return;
    };

    const {error} = validate_distro(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    };

    distro.name = req.body.name;
    distro.desc = req.body.desc;
    distro.url = req.body.url;
    res.send(distro);

});

app.delete("/api/distros/:id", (req, res) => {
    // check if exists
    const distro = distros.find(c => c.id === parseInt(req.params.id));

    if (!distro) {
        res.status(404).send("The distro with the given ID was not found.");
        return;
    };

    const idx = distros.indexOf(distro);
    distros.splice(idx, 1);

    res.send(distro);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}....`));