/**
 * Class model
 * @typedef {object} Class
 * @property {string} name.required - The name of the class (as defined by SIS)
 * @property {string} description - The description of the class (as defined by SIS)
 * @property {string} number.required - The number of the class (as defined by SIS). DOES NOT include the section number.
 * @property {string} section.required - The section number of the class (as defined by SIS). DOES NOT include the class number.
 * @property {string} term.required - The term of the class (as defined by SIS)
 * @property {string} instructor - The name of the instructor of the class.
 */

const express = require("express");
const classModel = require("../models/classModel");
const router = express.Router();




router.get("/search", async (req, res) => {
    try {
        const result = await classModel.aggregate([
            {
                $search: {
                    "autocomplete": {
                        "query": req.query.query,
                        "path": "name",
                        "fuzzy": {
                            "maxEdits": 2,
                            "maxExpansions": 100
                        }
                    }
                }
            },
            {
              $limit: 10
            }
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

/**
 * GET /classes
 * @summary Gets all the classes in the database
 * @tags Classes
 * @return {object} 200 - Success response
 * @return {object} 500 - Server error
 * @example request - example payload
 * {
 *  "name": "Data Structures",
 *  "description": "Data Structures in C++",
 *  "number": "EN.605.202",
 * "section": "01",
 * "term": "Spring 2021",
 * "instructor": "Dr. John Doe"
 * }
 * @example response - 200 - example success response
 * {
 * "name": "Data Structures",
 * "description": "Data Structures in C++",
 * "number": "EN.605.202",
 * "section": "01",
 *  "term": "Spring 2021",
 * "instructor": "Dr. John Doe"
 * }
 * @example response - 500 - example error response
 * {
 *  "message": "Internal server error"
 * }
 */
router.get("/", async (req, res) => {
    try {
        const classes = await classModel.find();
        res.json(classes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

/**
 * GET /classes/{id}
 * @summary Gets the class with the specified ID
 * @tags Classes
 * @param {string} id.path - The ID of the class to retrieve
 * @return {object} 200 - Success response
 * @return {object} 404 - Class Not Found Error
 * @return {object} 500 - Server error
 * @example response - 200 - example success response
 * {
 * "name": "Data Structures",
 * "description": "Data Structures in C++",
 * "number": "EN.605.202",
 * "section": "01",
 *  "term": "Spring 2021",
 * "instructor": "Dr. John Doe"
 * }
 * @example response - 404 - example not found error response
 * {
 *  "message": "Cannot find class"
 * }
 * @example response - 500 - example server error response
 * {
 *  "message": "Internal server error"
 * }
 */
router.get("/:id", getClass, (req, res) => {
    res.json(res.class);
}
);

/**
 * POST /classes
 * @summary Create a new class
 * @tags Classes
 * @param {object} request.body.required - The class information.
 * @property {string} request.body.name.required - The name of the class.
 * @property {string} request.body.description.required - The description of the class.
 * @property {string} request.body.number.required - The class number.
 * @property {string} request.body.section.required - The section number of the class.
 * @property {string} request.body.term.required - The term of the class.
 * @property {string} request.body.instructor.required - The name of the instructor for the class.
 * @return {object} 201 - The newly created class
 * @return {object} 400 - Bad request
 * @return {object} 500 - Server error
 * @example request - example payload
 * {
 *  "name": "Data Structures",
 *  "description": "Data Structures in C++",
 *  "number": "EN.605.202",
 *  "section": "01",
 *  "term": "Spring 2021",
 *  "instructor": "Dr. John Doe"
 * }
 * @example response - 201 - example success response
 * {
 *  "name": "Data Structures",
 *  "description": "Data Structures in C++",
 *  "number": "EN.605.202",
 *  "section": "01",
 *  "term": "Spring 2021",
 *  "instructor": "Dr. John Doe"
 * }
 * @example response - 400 - example error response
 * {
 *  "message": "Bad request"
 * }
 * @example response - 500 - example error response
 * {
 *  "message": "Internal server error"
 * }
 */
router.post("/", async (req, res) => {
  if (req.body.name == null) {
    res.status(400).json({ message: "Class name is required" });
  }
  if (req.body.number == null) {
    res.status(400).json({ message: "Class number is required" });
  }
  if (req.body.section == null) {
    res.status(400).json({ message: "Class section is required" });
  }
  if (req.body.term == null) {
    res.status(400).json({ message: "Class term is required" });
  }
  const classObject = new classModel({
    name: req.body.name,
    description: req.body.description,
    number: req.body.number,
    section: req.body.section,
    term: req.body.term,
    instructor: req.body.instructor,
  });
  try {
    const newClass = await classObject.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * PATCH /classes/{id}
 * @summary Update a class by ID
 * @tags Classes
 * @param {string} id.path.required - The ID of the class to update
 * @param {object} request.body.required - The updated class information
 * @return {object} 200 - Success response
 * @return {object} 404 - Class not found error
 * @return {object} 500 - Server error
 * @example request - example payload
 * {
 *  "name": "Data Structures",
 *  "description": "Data Structures in C++ and Python",
 *  "number": "EN.605.202",
 * "section": "02",
 * "term": "Fall 2022",
 * "instructor": "Dr. Jane Smith"
 * }
 * @example response - 200 - example success response
 * {
 * "name": "Data Structures",
 * "description": "Data Structures in C++ and Python",
 * "number": "EN.605.202",
 * "section": "02",
 *  "term": "Fall 2022",
 * "instructor": "Dr. Jane Smith"
 * }
 * @example response - 404 - example error response
 * {
 *  "message": "Class not found"
 * }
 * @example response - 500 - example error response
 * {
 *  "message": "Internal server error"
 * }
 */
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
  if (req.body.term == null) {
    return res.status(400).json({ message: "Term is required" });
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
  if (req.body.term != null) {
    res.class.term = req.body.term;
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

/**
 * DELETE /classes/delete-all
 * @summary Deletes all class objects
 * @tags Classes
 * @return {object} 200 - Success response
 * @return {object} 500 - Server error
 * @example response - 200 - example success response
 * {
 * "message": "All classes deleted"
 * }
 * @example response - 500 - example error response
 * {
 * "message": "Internal server error"
 * }
 */
router.delete("/delete-all", async (req, res) => {
  try {
    await classModel.deleteMany({});
    res.status(200).json({ message: "All classes deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/**
 * DELETE /classes/{id}
 * @summary Deletes a class by ID
 * @tags Classes
 * @param {string} id.path - ID of the class to delete
 * @return {object} 200 - Success response
 * @return {object} 404 - Class not found
 * @return {object} 500 - Server error
 * @example response - 200 - example success response
 * {
 * "name": "Data Structures",
 * "description": "Data Structures in C++ and Python",
 * "number": "EN.605.202",
 * "section": "02",
 *  "term": "Fall 2022",
 * "instructor": "Dr. Jane Smith"
 * }
 * @example response - 404 - example not found response
 * {
 *   "error": "Invalid class ID"
 * }
 *
 * @example response - 500 - example error response
 * {
 *   "message": "Internal server error"
 * }
 */
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
        if (err.name === "CastError") {
            return res.status(404).json({ message: "Invalid class ID" });
        }
        return res.status(500).json({ message: err.message });
    }
    res.class = classObject;
    next();
}

/**
 * POST /classes/batch-data
 * @description Creates multiple class object from a JSON array
 * @tags Classes
 * @summary Creates multiple class objects from a JSON array of class objects
 * @param {requestBodyType} request.body.required - Body of the request containing the JSON array of class objects
 * @return {responseType} 201 - Success response
 * @return {responseType} 400 - Bad request
 * @example request - example payload
 * [
 * {
 * "name": "Data Structures",
 * "description": "Data Structures in C++ and Python",
 * "number": "EN.605.202",
 * "section": "02",
 * "term": "Fall 2022",
 *  "instructor": "Dr. Jane Smith"
 * },
 * {
 * "name": "Algorithms",
 * "description": "Algorithms in C++ and Python",
 * "number": "EN.605.203",
 * "section": "02",
 * "term": "Fall 2022",
 * "instructor": "Dr. Jane Smith"
 * }
 * ]
 * @example response - 201 - example success response
 * [
 * {
 * "name": "Data Structures",
 * "description": "Data Structures in C++ and Python",
 * "number": "EN.605.202",
 * "section": "02",
 * "term": "Fall 2022",
 * "instructor": "Dr. Jane Smith"
 * },
 * {
 * "name": "Algorithms",
 * "description": "Algorithms in C++ and Python",
 * "number": "EN.605.203",
 * "section": "02",
 * "term": "Fall 2022",
 * "instructor": "Dr. Jane Smith"
 * }
 * ]
 * @example response - 400 - example bad request response
 * {
 *  "message": "Invalid class ID"
 * }
 * @example response - 500 - example error response
 * {
 * "message": "Internal server error"
 * }
 */
router.post("/batch-data", async (req, res) => {
  const objects = [];
  for (let i = 0; i < req.body.length; i++) {
    const curr = req.body[i];
    const classObject = new classModel({
      name: curr.name,
      description: curr.description,
      number: curr.number,
      section: curr.section,
      term: curr.term,
      instructor: curr.instructor,
    });
    objects.push(classObject);
  }
  try {
    const newClasses = await classModel.insertMany(objects);
    res.status(201).json(newClasses);
  }
  catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
