const express = require('express');

const app = express();

const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = require("./swagger.json");

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config({ path: "./.env" })

app.use(cors());
app.use(helmet());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = process.env.NODE_ENV === "test" ? process.env.TEST_URI : process.env.ATLAS_URI;
require("./db").connect(uri);

const studentRoutes = require("./routes/studentRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const classRoutes = require("./routes/classRoutes");
const schoolRoutes = require("./routes/schoolRoutes");

app.use("/students", studentRoutes);
app.use("/tutors", tutorRoutes);
app.use("/classes", classRoutes);
app.use("/schools", schoolRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`)
  );
}

app.use((err, req, res, next) => {
  if (err) {
    const code = err.status || 500;
    res.status(code).json({
      status: code,
      message: err.message || `Internal Server Error!`,
    });
  }
  next();
});

app.get("/", (req, res) => {
    res.send("Welcome to the Learn Now API!");
}); 
  
module.exports = app;