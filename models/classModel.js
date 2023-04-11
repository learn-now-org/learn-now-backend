const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    number : {
        type: String,
        required: true,
    },
    section : {
        type: String,
        required: true,
    },
    semester : {
        type: String,
        required: true,
    },
    year : {
        type: Number,
        required: true,
    },  
    instructor : {
        type: String,
        required: false,
    },
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;


    