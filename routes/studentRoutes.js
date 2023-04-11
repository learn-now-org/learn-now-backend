const express = require("express");
const studentModel = require("../models/studentModel");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const students = await studentModel.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    }
);

router.get("/:id", getStudent, (req, res) => {
    res.json(res.student);
}
);


router.post("/", async (req, res) => {
    const student = new studentModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        classes: req.body.classes,
    });
    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch("/:id", getStudent, async (req, res) => {
    if (req.body.name != null) {
        res.student.name = req.body.name;
    }
    if (req.body.email != null) {
        res.student.email = req.body.email;
    }
    if (req.body.phone != null) {
        res.student.phone = req.body.phone;
    }
    if (req.body.classes != null) {
        res.student.classes = req.body.classes;
    }
    try {
        const updatedStudent = await res.student.save();
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.delete("/:id", getStudent, async (req, res) => {
    try {
        await res.student.remove();
        res.json({ message: "Deleted Student" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

async function getStudent(req, res, next) {
    let student;
    try {
        student = await studentModel.findById(req.params.id);
        if (student == null) {
            return res.status(404).json({ message: "Cannot find student" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.student = student;
    next();
}

module.exports = router;
