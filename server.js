const express = require('express');
const app = express();
<<<<<<< Updated upstream
=======

const expressJSDocSwagger = require('express-jsdoc-swagger');
const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));

const options = {
  info: {
    version: '1.0.0',
    title: 'Learn Now API Documentation',
    description: "Documentation for the Learn Now API. This API is used to manage students, tutors, classes, and schools for the Learn Now application.",
    license: {
      name: 'MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'Aayush Gandhi',
      url: 'https://github.com/learn-now-org/learn-now-backend',
      email: 'aayushgandhi2001@gmail.com',
    },
    termsOfService: 'https://github.com/learn-now-org/learn-now-backend',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
    {
      url: "https://learn-now-backend.vercel.app/",
      description: "Production server",
    }
      
  ],
  filesPattern: './routes/*.js',
  baseDir: __dirname,
  // URL where SwaggerUI will be rendered
  swaggerUIPath: '/docs',
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,
  // Open API JSON Docs endpoint.
  apiDocsPath: '/v3/api-docs',
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  swaggerUiOptions: {
    customCssUrl: '/public/swagger-ui.css', 
    customSiteTitle: "Learn Now API Documentation",
  },
};

app.use('/public', express.static(path.join(__dirname, 'public')));

expressJSDocSwagger(app)(options);

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  
=======

const axios = require("axios");

app.get("/refresh", async (req, res) => {
  const SIS_API_KEY = process.env.SIS_API_KEY;
  const baseURL = "https://sis.jhu.edu/api";
  const getAllSchools = `${baseURL}/classes/codes/schools?key=${SIS_API_KEY}`;
  try {
    const response = await axios.get(getAllSchools);
    const schools = response.data;
    // For each school, get all the classes with /classes/{school}?key=apikeyvalue
    for (let i = 0; i < schools.length; i++) {
      const school = schools[i].Name;
      const getAllClasses = `${baseURL}/classes/${school}?key=${SIS_API_KEY}`;
      const response = await axios.get(getAllClasses);
      const classes = response.data;
    }
  } catch (err) {
    console.log(err);
  }
});



>>>>>>> Stashed changes
module.exports = app;