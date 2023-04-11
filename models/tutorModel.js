const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone : {
        type: String,
        required: false,
    },
    classes : {
        type: Array,
        required: false,
    },
    rating : {
        type: Number,
        required: false,
    },
});

const Tutor = mongoose.model("Tutor", tutorSchema);

module.exports = Tutor;
