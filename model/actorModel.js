const mongoose = require('mongoose');
const shortid = require('shortid');

const actorModel = mongoose.Schema({
    actorId: {
        type: String,
        default: shortid.generate,
        // required: [true, 'Actor ID is required'],
    },
    fullName: {
        type: String,
        required: [true, 'Full Name is required'],
    },
    birthDate: {
        type: String,
        required: [true, 'Date of Birth is required'],
    },
    birthPlace: {
        type: String,
        default: "",
        // required: [true, 'Place of Birth is required'],
    },
    bio: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, 'Gender is required'],
    },
    country: {
        type: String,
        default: "",
        // required: [true, 'Country is required']
    },
    profile: {
        type: String,
        required: [true, 'Profile is required']
    },
    awards: [{
        name: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
    }],
    death_date: {
        type: Date,
        required: false
    },
});

module.exports = mongoose.model('Actors', actorModel);