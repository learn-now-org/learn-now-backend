const express = require("express");
const tutorModel = require("../models/tutorModel");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const tutors = await tutorModel.find();
        res.json(tutors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    }
);

router.get("/:id", getTutor, (req, res) => {
    res.json(res.tutor);
}
);

router.post("/", async (req, res) => {
    const tutor = new tutorModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        classes: req.body.classes,
        rating: req.body.rating,
    });
    try {
        const newTutor = await tutor.save();
        res.status(201).json(newTutor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.patch("/:id", getTutor, async (req, res) => {
    if (req.body.name != null) {
        res.tutor.name = req.body.name;
    }
    if (req.body.email != null) {
        res.tutor.email = req.body.email;
    }
    if (req.body.phone != null) {
        res.tutor.phone = req.body.phone;
    }
    if (req.body.classes != null) {
        res.tutor.classes = req.body.classes;
    }
    if (req.body.rating != null) {
        res.tutor.rating = req.body.rating;
    }
    try {
        const updatedTutor = await res.tutor.save();
        res.json(updatedTutor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.delete("/:id", getTutor, async (req, res) => {
    try {
        await res.tutor.remove();
        res.json({ message: "Deleted Tutor" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

async function getTutor(req, res, next) {
    let tutor;
    try {
        tutor = await tutorModel.findById(req.params.id);
        if (tutor == null) {
            return res.status(404).json({ message: "Cannot find tutor" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.tutor = tutor;
    next();
}

module.exports = router;
