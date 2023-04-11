/**
 * School model
 * @typedef {object} School
 * @property {string} name.required - The name of the school
 * @property {string} address.required - The address of the school
 */

const express = require("express");
const schoolModel = require("../models/schoolModel");
const router = express.Router();

/**
 * GET /schools
 * @summary Retrieves a list of all schools
 * @tags Schools
 * @return {object} 200 - Success response
 * @return {object} 500 - Server error
 * @example response - 200 - Example success response
 * [
 *  {
 *    "_id": "60b8e71ebeaa58378c10c3d3",
 *    "name": "ABC School",
 *    "address": "123 Main St"
 *  },
 *  {
 *    "_id": "60b8e752beaa58378c10c3d4",
 *    "name": "XYZ School",
 *    "address": "456 Elm St"
 *  }
 * ]
 * @example response - 500 - Example error response
 * {
 *  "message": "Internal server error"
 * }
 */
router.get("/", async (req, res) => {
    try {
        const schools = await schoolModel.find();
        res.json(schools);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    }
);

/**
 * GET /schools/{id}
 * @summary Retrieves a single school by ID
 * @tags Schools
 * @param {string} id.path.required - The ID of the school to retrieve
 * @return {object} 200 - Success response
 * @return {object} 404 - School not found
 * @return {object} 500 - Server error
 * @example response - 200 - Example success response
 * {
 *  "_id": "60b8e71ebeaa58378c10c3d3",
 *  "name": "ABC School",
 *  "address": "123 Main St"
 * }
 * @example response - 404 - Example not found response
 * {
 *  "message": "Cannot find school"
 * }
 * @example response - 500 - Example error response
 * {
 *  "message": "Internal server error"
 * }
 */
router.get("/:id", getSchool, (req, res) => {
    res.json(res.school);
}
);

/**
 * POST /schools
 * @summary Creates a new school
 * @tags Schools
 * @param {string} request.body.name.required - The name of the school to create
 * @param {string} request.body.address.required - The address of the school to create
 * @return {object} 201 - Success response
 * @return {object} 400 - Invalid request
 * @return {object} 500 - Server error
 * @example request - Example payload
 * {
 *  "name": "New School",
 *  "address": "789 High St"
 * }
 * @example response - 201 - Example success response
 * {
 *  "_id": "60b8e71ebeaa58378c10c3d3",
 *  "name": "New School",
 *  "address": "789 High St"
 * }
 * @example response - 400 - Example error response
 * {
 *  "message": "Bad request"
 * }
 * @example response - 500 - Example error response
 * {
 *  "message": "Internal server error"
 * }
 */
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

/**
 * PATCH /schools/{id}
 * @summary Update a school by ID
 * @tags Schools
 * @param {string} id.path - School ID
 * @param {object} request.body - School object to update
 * @return {object} 200 - Updated school object
 * @return {object} 400 - Bad request response
 * @return {object} 404 - School not found response
 * @return {object} 500 - Server error response
 * @example request - example payload
 * {
 *   "name": "New School Name",
 *   "address": "New School Address"
 * }
 * @example response - 200 - example success response
 * {
 *   "_id": "6115fb7abf2ff5002dbbc118",
 *   "name": "New School Name",
 *   "address": "New School Address",
 *   "__v": 0
 * }
 * @example response - 400 - example error response
 * {
 *   "message": "Name is required"
 * }
 * @example response - 404 - example error response
 * {
 *   "message": "Cannot find school"
 * }
 */
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

/**
 * DELETE /schools/{id}
 * @summary Deletes a school by ID
 * @tags Schools
 * @param {string} id.path - ID of the school to delete
 * @return {object} 200 - Success response
 * @return {object} 404 - Not found response
 * @return {object} 500 - Server error
 * @example response - 200 - example success response
 * {
 *   "_id": "61546e57d10a870b8aeb55b2",
 *   "name": "Example School",
 *   "address": "123 Example St"
 * }
 * @example response - 404 - example not found response
 * {
 *   "message": "Cannot find school"
 * }
 * @example response - 500 - example server error response
 * {
 *   "message": "Internal server error"
 * }
 */
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