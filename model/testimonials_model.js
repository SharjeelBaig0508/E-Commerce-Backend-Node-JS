/* Node Imports */

/* Framework Imports */
var mongoose = require("mongoose");

/* Local Imports */


const testimonials_model = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    testimonial: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    }
});

var testimonials = mongoose.model("testimonials", testimonials_model);
module.exports = testimonials;
