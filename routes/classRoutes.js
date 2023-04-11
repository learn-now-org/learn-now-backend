const express = require("express");
const classModel = require("../models/classModel");
const router = express.Router();

// This is class Schema
// const classSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: false,
//     },
//     number : {
//         type: String,
//         required: true,
//     },
//     section : {
//         type: String,
//         required: true,
//     },
//     semester : {
//         type: String,
//         required: true,
//     },
//     year : {
//         type: Number,
//         required: true,
//     },  
//     instructor : {
//         type: String,
//         required: false,
//     },
// });

router.get("/", async (req, res) => {
    try {
        const classes = await classModel.find();
        res.json(classes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.get("/:id", getClass, (req, res) => {
    res.json(res.class);
}
);

router.post("/", async (req, res) => {
    const classObject = new classModel({
        name: req.body.name,
        description: req.body.description,
        number: req.body.number,
        section: req.body.section,
        semester: req.body.semester,
        year: req.body.year,
        instructor: req.body.instructor,
    });
    try {
        const newClass = await classObject.save();
        res.status(201).json(newClass);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.patch("/:id", getClass, async (req, res) => {
    if (req.body.name != null) {
        res.class.name = req.body.name;
    }
    if (req.body.description != null) {
        res.class.description = req.body.description;
    }
    if (req.body.number != null) {
        res.class.number = req.body.number;
    }
    if (req.body.section != null) {
        res.class.section = req.body.section;
    }
    if (req.body.semester != null) {
        res.class.semester = req.body.semester;
    }
    if (req.body.year != null) {
        res.class.year = req.body.year;
    }
    if (req.body.instructor != null) {
        res.class.instructor = req.body.instructor;
    }
    try {
        const updatedClass = await res.class.save();
        res.json(updatedClass);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.delete("/:id", getClass, async (req, res) => {
    try {
        await res.class.remove();
        res.json({ message: "Deleted Class" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

async function getClass(req, res, next) {
    let classObject;
    try {
        classObject = await classModel.findById(req.params.id);
        if (classObject == null) {
            return res.status(404).json({ message: "Cannot find class" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.class = classObject;
    next();
}

module.exports = router;
