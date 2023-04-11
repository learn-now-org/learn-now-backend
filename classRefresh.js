// Make a function to refresh the class list by pulling all the data from the SIS API and
// calling the batch-data route to insert the data into the database.
const axios = require("axios");
require("dotenv").config("./.env");
const SIS_API_KEY = process.env.SIS_API_KEY;
const baseURL = "https://sis.jhu.edu/api/classes";

const refreshClassList = async () => {
    try {
        const allSchoolsURL = `${baseURL}/codes/schools?key=${SIS_API_KEY}`;
        const allSchools = await axios.get(allSchoolsURL);
        const schools = allSchools.data;
        // Loop through all the schools
        for (let i = 0; i < schools.length; i++) {
            const currName = schools[i].Name;
            const allClassesURL = `${baseURL}/${currName}/current?key=${SIS_API_KEY}`;
            const allClasses = await axios.get(allClassesURL);
            const classes = allClasses.data;
            const classList = [];
            for (let j = 0; j < classes.length; j++) {
                const currClass = classes[j];
                const classObject = {
                    name: currClass.Title,
                    description: currClass.Department,
                    number: currClass.OfferingName,
                    section: currClass.SectionName,
                    term: currClass.Term_IDR,
                    instructor: currClass.InstructorsFullName,
                };
                classList.push(classObject);
            }
            const batchDataURL = "http://localhost:5000/classes/batch-data";
            axios.post(batchDataURL, classList)
                .then((res) => {
                    console.log(`Finished adding ${classList.length} classes for ${currName} with status ${res.status}`);
                })
                .catch((err) => {
                    console.log(err);
                    console.log(err.response);
                }
            );
        }
    } catch (err) {
        console.log(err);
        console.log(err.response);
    }
};

refreshClassList();