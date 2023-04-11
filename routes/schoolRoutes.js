const express = require("express");
const schoolModel = require("../models/schoolModel");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const schools = await schoolModel.find();
        res.json(schools);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    }
);

router.get("/:id", getSchool, (req, res) => {
    res.json(res.school);
}
);

router.post("/", async (req, res) => {
    const school = new schoolModel({
        name: req.body.name,
        address: req.body.address,
    });
    try {
        const newSchool = await school.save();
        res.status(201).json(newSchool);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.patch("/:id", getSchool, async (req, res) => {
    if (req.body.name == null) {
        return res.status(400).json({ message: "Name is required" });
    }
    if (req.body.name != null) {
        res.school.name = req.body.name;
    }
    if (req.body.address != null) {
        res.school.address = req.body.address;
    }
    try {
        const updatedSchool = await res.school.save();
        res.json(updatedSchool);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.delete("/:id", async (req, res) => {
    try {
        const schoolMade = await schoolModel.findByIdAndRemove(req.params.id);
        if (schoolMade == null) {
            return res.status(404).json({ message: "Cannot find school" });
        }
        res.json(schoolMade);
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(404).json({ message: "Cannot find school" });
        }
        res.status(500).json({ message: err.message });
    }
}
);

async function getSchool(req, res, next) {
    let school;
    try {
        school = await schoolModel.findById(req.params.id);
        if (school == null) {
            return res.status(404).json({ message: "Cannot find school" });
        }
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(404).json({ message: "Cannot find school" });
        }
        return res.status(500).json({ message: err.message });
    }
    res.school = school;
    next();
}

module.exports = router;