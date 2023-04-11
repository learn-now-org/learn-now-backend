/**
 * @swagger
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       required:
 *         - name
 *         - number
 *         - section
 *         - semester
 *         - year
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the class (as defined by SIS)
 *         description:
 *           type: string
 *           description: The description of the class (as defined by SIS)
 *         number:
 *           type: string
 *           description: The number of the class (as defined by SIS). DOES NOT include the section number.
 *         section:
 *           type: string
 *           description: The section number of the class (as defined by SIS). DOES NOT include the class number.
 *         semester:
 *           type: string
 *           description: The semester of the class (as defined by SIS).
 *         year:
 *           type: number
 *           description: The year of the class (as defined by SIS).
 *         instructor:
 *           type: string
 *           description: The name of the instructor of the class.
 *       example:
 *         name: Organic Chemistry I
 *         description: This is a course for students who want to learn the basics of organic chemistry.
 *         number: EN.101.101
 *         section: 01
 *         semester: Fall
 *         year: 2020
 *         instructor: Aayush Gandhi
 */

const express = require("express");
const classModel = require("../models/classModel");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const classes = await classModel.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", getClass, (req, res) => {
  res.json(res.class);
});

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
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id", getClass, async (req, res) => {
  if (req.body.name == null) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (req.body.number == null) {
    return res.status(400).json({ message: "Number is required" });
  }
  if (req.body.section == null) {
    return res.status(400).json({ message: "Section is required" });
  }
  if (req.body.semester == null) {
    return res.status(400).json({ message: "Semester is required" });
  }
  if (req.body.year == null) {
    return res.status(400).json({ message: "Year is required" });
  }
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
});

router.delete("/:id", async (req, res) => {
  try {
    const classMade = await classModel.findByIdAndRemove(req.params.id);
    if (classMade == null) {
      return res.status(404).json({ message: "Cannot find class" });
    }
    res.json(classMade);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "Invalid class ID" });
    }
    res.status(500).json({ message: err.message });
  }
});

async function getClass(req, res, next) {
  let classObject;
  try {
    classObject = await classModel.findById(req.params.id);
    if (classObject == null) {
      return res.status(404).json({ message: "Cannot find class" });
    }
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ message: "Invalid class ID" });
    }
    return res.status(500).json({ message: err.message });
  }
  res.class = classObject;
  next();
}

module.exports = router;
