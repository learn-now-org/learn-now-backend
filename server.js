const express = require('express');
const app = express();
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config({ path: "./.env" })

app.use(cors());
app.use(helmet());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = process.env.ATLAS_URI;
require("./db").connect(uri);

const studentRoutes = require("./routes/studentRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const classRoutes = require("./routes/classRoutes");
const schoolRoutes = require("./routes/schoolRoutes");

app.use("/students", studentRoutes);
app.use("/tutors", tutorRoutes);
app.use("/classes", classRoutes);
app.use("/schools", schoolRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

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