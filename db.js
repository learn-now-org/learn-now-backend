const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

async function connect(uri) {
  try {
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }); 
    const database = mongoose.connection;
    database.on('error', (error) => {
        console.log(error)
    })

    database.once('connected', () => {
        console.log("Connected to database")
    })
  } catch (err) {
    console.log(err);
  }
}

mongoose.set('strictQuery', true);

module.exports = { connect };