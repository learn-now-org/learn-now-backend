/**
* Student Model
* @typedef {object} Student
* @property {string} name.required - The name of the student.
* @property {string} email.required - The email of the student.
* @property {string} phone - The phone number of the student.
* @property {Array.<Class>} classes - An array of classes that the student is enrolled in.
*/

const express = require("express");
const studentModel = require("../models/studentModel");
const router = express.Router();

/**
 * GET /students
 * @summary Retrieves a list of all students
 * @tags Students
 * @return {object[]} 200 - Array of student objects
 * @return {object} 500 - Internal server error
 * @example response - 200 - Example success response
 * [
 *   {
 *     "_id": "60e3dc636a3d3a0015c66f96",
 *     "name": "John Doe",
 *     "email": "johndoe@example.com",
 *     "phone": "123-456-7890",
 *     "classes": ["60e3dc636a3d3a0015c66f95", "60e3dc636a3d3a0015c66f94"],
 *     "__v": 0
 *   },
 *   {
 *     "_id": "60e3dc636a3d3a0015c66f97",
 *     "name": "Jane Doe",
 *     "email": "janedoe@example.com",
 *     "phone": "123-456-7890",
 *     "classes": ["60e3dc636a3d3a0015c66f95", "60e3dc636a3d3a0015c66f94"],
 *     "__v": 0
 *   }
 * ]
 * @example response - 500 - Example error response
 * {
 *   "message": "Internal server error"
 * }
 */
router.get("/", async (req, res) => {
    try {
        const students = await studentModel.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    }
);

/**
 * GET /students/{id}
 * @summary Retrieves a student by their ID
 * @tags Students
 * @param {string} id.path - ID of the student to retrieve
 * @return {object} 200 - Student object
 * @return {object} 404 - Student not found
 * @return {object} 500 - Internal server error
 * @example response - 200 - Example success response
 * {
 *   "_id": "60e3dc636a3d3a0015c66f96",
 *   "name": "John Doe",
 *   "email": "johndoe@example.com",
 *   "phone": "123-456-7890",
 *   "classes": ["60e3dc636a3d3a0015c66f95", "60e3dc636a3d3a0015c66f94"],
 *   "__v": 0
 * }
 * @example response - 404 - Example error response when student is not found
 * {
 *   "message": "Cannot find student"
 * }
 * @example response - 500 - Example error response
 * {
 *   "message": "Internal server error"
 * }
 */
router.get("/:id", getStudent, (req, res) => {
    res.json(res.student);
}
);

/**
 * POST /students
 * @summary Create a new student
 * @tags Students
 * @param {object} request.body.required - Student information
 * @param {string} request.body.name.required - Name of the student
 * @param {string} request.body.email.required - Email of the student
 * @param {string} request.body.phone - Phone number of the student
 * @param {array} request.body.classes - List of classes the student is enrolled in
 * @return {object} 201 - Success response with the new student object
 * @return {object} 400 - Bad request response if the request body is missing required fields
 * @return {object} 500 - Server error
 * @example request - example payload
 * {
 *  "name": "John Doe",
 *  "email": "john.doe@example.com",
 *  "phone": "123-456-7890",
 *  "classes": ["EN.601.220", "EN.601.229"]
 * }
 * @example response - 201 - example success response
 * {
 * "name": "John Doe",
 * "email": "john.doe@example.com",
 * "phone": "123-456-7890",
 * "classes": ["EN.601.220", "EN.601.229"],
 * "_id": "60eeb48d5d92562898f01f2b",
 * "__v": 0
 * }
 * @example response - 400 - example error response
 * {
 *  "message": "Name is required"
 * }
 */
router.post("/", async (req, res) => {
    if (req.body.name == null) {
        return res.status(400).json({ message: "Name is required" });
    }
    if (req.body.email == null) {
        return res.status(400).json({ message: "Email is required" });
    }
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

/**
 * PATCH /students/{id}
 * @summary Update a student by ID
 * @tags Students
 * @param {string} id.path - ID of the student to update
 * @param {object} request.body.required - Student object to update
 * @param {string} request.body.name - Name of the student
 * @param {string} request.body.email - Email of the student
 * @param {string} [request.body.phone] - Phone number of the student
 * @param {string[]} [request.body.classes] - Array of class IDs that the student is enrolled in
 * @return {object} 200 - Success response with updated student object
 * @return {object} 400 - Bad request error
 * @return {object} 404 - Student not found error
 * @return {object} 500 - Server error
 * @example request - example payload
 * {
 *  "name": "John Doe",
 *  "email": "john.doe@example.com",
 *  "phone": "123-456-7890",
 *  "classes": ["614ff10ee155bc68e825d57d", "614ff1e5e155bc68e825d580"]
 * }
 * @example response - 200 - example success response
 * {
 *  "_id": "614fefe7e155bc68e825d57a",
 *  "name": "John Doe",
 *  "email": "john.doe@example.com",
 *  "phone": "123-456-7890",
 *  "classes": ["614ff10ee155bc68e825d57d", "614ff1e5e155bc68e825d580"],
 *  "__v": 0
 * }
 * @example response - 400 - example bad request response
 * {
 *  "message": "Phone number is invalid"
 * }
 * @example response - 404 - example student not found response
 * {
 *  "message": "Cannot find student"
 * }
 * @example response - 500 - example error response
 * {
 *  "message": "Internal server error"
 * }
 */
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

/**
 * DELETE /students/{id}
 * @summary Deletes a student with the specified ID
 * @tags Students
 * @param {string} id.path - ID of the student to delete
 * @return {object} 200 - Success response
 * @return {object} 404 - Error response if student not found
 * @return {object} 500 - Server error
 * @example response - 200 - Example success response
 * {
 *   "_id": "61c07d81e15a8a4d888e84e7",
 *   "name": "Jane Doe",
 *   "email": "jane.doe@example.com",
 *   "phone": "555-555-5555",
 *   "classes": ["EN.601.101", "EN.601.102"]
 * }
 * @example response - 404 - Example error response if student not found
 * {
 *   "message": "Cannot find student"
 * }
 * @example response - 500 - Example error response if server error occurs
 * {
 *   "message": "Internal server error"
 * }
 */
router.delete("/:id", async (req, res) => {
    try {
        const student = await studentModel.findByIdAndRemove(req.params.id);
        if (student == null) {
            return res.status(404).json({ message: "Cannot find student" });
        }
        res.json(student);
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(404).json({ message: "Cannot find student" });
        }
        return res.status(500).json({ message: err.message });
    }
});

async function getStudent(req, res, next) {
    let student;
    try {
        student = await studentModel.findById(req.params.id);
        if (student == null) {
            return res.status(404).json({ message: "Cannot find student" });
        }
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(404).json({ message: "Cannot find student" });
        }
        return res.status(500).json({ message: err.message });
    }
    res.student = student;
    next();
}

module.exports = router;
