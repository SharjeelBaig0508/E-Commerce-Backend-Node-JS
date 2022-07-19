/* Node Imports */

/* Framework Imports */
const Joi = require('joi');

/* Local Imports */
const common_utils = require("./common_utils");


filter_multiple_testimonials_object = (testimonials) => {
    let testimonials_array = [];
    testimonials.forEach(testimonials => {
        testimonials_array.push({
            id: testimonials._id,
            name: testimonials.name,
            image: testimonials.image,
            testimonial: testimonials.testimonial,
        })
    });
    return testimonials_array;
}


filter_testimonials_object = (testimonials) => {
    if (!testimonials){
        return {}
    }
    return {
        id: testimonials._id,
        name: testimonials.name,
        image: testimonials.image,
        testimonial: testimonials.testimonial,
    }
}


/* Our testimonials Validation */
testimonials_validation = async (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        image: Joi.string().uri().required(),
        testimonial: Joi.string().required(),
    });
    return schema.validate(data);
}


testimonials_update_validation = async (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50),
        image: Joi.string().uri(),
        testimonial: Joi.string(),
    });
    return schema.validate(data);
}


module.exports = {
    filter_multiple_testimonials_object,
    filter_testimonials_object,
    testimonials_validation,
    testimonials_update_validation
}
