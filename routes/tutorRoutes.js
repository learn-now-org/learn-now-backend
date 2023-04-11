/**
* Tutor model
* @typedef {object} Tutor
* @property {string} name.required - The name of the tutor
* @property {string} email.required - The email of the tutor
* @property {string} phone - The phone number of the tutor
* @property {Class[]} classes - The classes the tutor teaches
* @property {number} rating - The rating of the tutor
*/

const express = require("express");
const tutorModel = require("../models/tutorModel");
const router = express.Router();

/**
 * GET /tutors
 * @summary Gets all tutors
 * @tags Tutors
 * @return {object} 200 - Success response
 * @return {object} 500 - Server error
 * @example response - 200 - example success response
 * [
 *   {
 *     "_id": "6139cb6ca1b0190a48a28a1d",
 *     "name": "John Doe",
 *     "email": "johndoe@gmail.com",
 *     "phone": "123-456-7890",
 *     "classes": ["Math", "Physics"],
 *     "rating": 4.5,
 *     "__v": 0
 *   },
 *   {
 *     "_id": "6139cb7fa1b0190a48a28a1e",
 *     "name": "Jane Doe",
 *     "email": "janedoe@gmail.com",
 *     "phone": "987-654-3210",
 *     "classes": ["Biology", "Chemistry"],
 *     "rating": 4.8,
 *     "__v": 0
 *   }
 * ]
 * @example response - 500 - example error response
 * {
 *   "message": "Internal server error"
 * }
 */
router.get("/", async (req, res) => {
    try {
        const tutors = await tutorModel.find();
        res.json(tutors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    }
);

/**
 * GET /tutors/{id}
 * @summary Gets a tutor by ID
 * @tags Tutors
 * @param {string} id.path - The ID of the tutor to retrieve
 * @return {object} 200 - Success response
 * @return {object} 404 - Tutor not found
 * @example response - 200 - example success response
 * {
 *   "_id": "6139cb6ca1b0190a48a28a1d",
 *   "name": "John Doe",
 *   "email": "johndoe@gmail.com",
 *   "phone": "123-456-7890",
 *   "classes": ["Math", "Physics"],
 *   "rating": 4.5,
 *   "__v": 0
 * }
 * @example response - 404 - example error response
 * {
 *   "message": "Cannot find tutor"
 * }
 */
router.get("/:id", getTutor, (req, res) => {
    res.json(res.tutor);
}
);

/**
 * POST /tutors
 * @summary Creates a new tutor
 * @tags Tutors
 * @param {object} request.body.required - The tutor's information
 * @param {string} request.body.name.required - The name of the tutor
 * @param {string} request.body.email.required - The email of the tutor
 * @param {string} [request.body.phone] - The phone number of the tutor
 * @param {Array<string>} [request.body.classes] - An array of the classes taught by the tutor
 * @param {number} [request.body.rating] - The tutor's rating
 * @return {object} 201 - Success response
 * @return {object} 400 - Bad request response
 * @return {object} 500 - Server error
 * @example request - example payload
 * {
 *   "name": "Jane Doe",
 *   "email": "jane.doe@example.com",
 *   "phone": "+1 (555) 123-4567",
 *   "classes": ["Algebra", "Geometry"],
 *   "rating": 4.5
 * }
 * @example response - 201 - example success response
 * {
 *   "_id": "6158b7a1e23ab2671ec9e25d",
 *   "name": "Jane Doe",
 *   "email": "jane.doe@example.com",
 *   "phone": "+1 (555) 123-4567",
 *   "classes": ["Algebra", "Geometry"],
 *   "rating": 4.5,
 *   "__v": 0
 * }
 * @example response - 400 - example error response
 * {
 *   "message": "Name is required"
 * }
 */
router.post("/", async (req, res) => {
    if (req.body.name == null) {
        return res.status(400).json({ message: "Name is required" });
    }
    if (req.body.email == null) {
        return res.status(400).json({ message: "Email is required" });
    }
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

/**
 * PATCH /{id}
 * @summary Updates a tutor by ID
 * @tags Tutors
 * @param {string} id.path - ID of the tutor to update
 * @param {object} request.body - Request body for updating a tutor
 * @param {string} request.body.name - New name of the tutor
 * @param {string} request.body.email - New email of the tutor
 * @param {string} request.body.phone - New phone number of the tutor
 * @param {Array<string>} request.body.classes - New list of classes taught by the tutor
 * @param {number} request.body.rating - New rating of the tutor
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @return {object} 404 - Tutor not found response
 * @return {object} 500 - Server error
 * @example request - example payload
 * {
 *  "name": "Jane Doe",
 *  "email": "jane.doe@gmail.com",
 *  "phone": "123-456-7890",
 *  "classes": ["Math", "Science"],
 *  "rating": 4.5
 * }
 * @example response - 200 - example success response
 * {
 *  "_id": "1234567890abcdef",
 *  "name": "Jane Doe",
 *  "email": "jane.doe@gmail.com",
 *  "phone": "123-456-7890",
 *  "classes": ["Math", "Science"],
 *  "rating": 4.5
 * }
 * @example response - 400 - example bad request response
 * {
 *  "message": "Name is required"
 * }
 * @example response - 404 - example tutor not found response
 * {
 *  "message": "Cannot find tutor"
 * }
 * @example response - 500 - example server error response
 * {
 *  "message": "Internal server error"
 * }
 */
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

/**
 * DELETE /tutors/{id}
 * @summary Deletes a tutor by ID
 * @tags Tutors
 * @param {string} id.path - ID of the tutor to delete
 * @return {object} 200 - Success response
 * @return {object} 400 - Invalid request body
 * @return {object} 404 - Tutor not found
 * @return {object} 500 - Server error
 * @example response - 200 - example success response
 * {
 *  "_id": "61563d35e9d0f9e13b209c84",
 *  "name": "John Doe",
 *  "email": "johndoe@example.com",
 *  "phone": "123-456-7890",
 *  "classes": ["Math", "English"],
 *  "rating": 4.5,
 *  "__v": 0
 * }
 * @example response - 400 - example error response
 * {
 *  "message": "Invalid request body"
 * }
 * @example response - 404 - example error response
 * {
 *  "message": "Cannot find tutor"
 * }
 * @example response - 500 - example error response
 * {
 *  "message": "Internal server error"
 * }
 */
router.delete("/:id", async (req, res) => {
    try {
        const tutor = await tutorModel.findByIdAndRemove(req.params.id);
        if (tutor == null) {
            return res.status(404).json({ message: "Cannot find tutor" });
        }
        res.json(tutor);
    } catch (err) {
        if (err.name == "CastError") {
            return res.status(404).json({ message: "Cannot find tutor" });
        }
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
        if (err.name == "CastError") {
            return res.status(404).json({ message: "Cannot find tutor" });
        }
        return res.status(500).json({ message: err.message });
    }
    res.tutor = tutor;
    next();
}

module.exports = router;
