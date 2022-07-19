/* Node Imports */

/* Framework Imports */

/* Local Imports */
var testimonials_model = require('../model/testimonials_model');
var testimonials_utils = require('../utils/testimonials_utils');
var response_codes = require("../utils/response_codes");
var common_utils = require("../utils/common_utils");


const read_testimonials_controller = async (filter_body) => {
    if (common_utils.object_is_empty(filter_body)) {
        const testimonials = await testimonials_model.find({ status: true });

        return [ testimonials_utils.filter_multiple_testimonials_object(testimonials), 
                 response_codes.CODE_RESPONSE_SUCCESS, 
                 response_codes.MESSAGE_RESPONSE_SUCCESS ];
    }
    if (!common_utils.validate_id(filter_body.id)) 
        return [ null, 
                 response_codes.CODE_BAD_REQUEST, 
                 response_codes.MESSAGE_INVALID_PARAMETERS + "id" ];

    const testimonials = await testimonials_model.findOne({ _id: filter_body.id,
                                                     status: true });

    return [ testimonials_utils.filter_testimonials_object(testimonials), 
             response_codes.CODE_RESPONSE_SUCCESS, 
             response_codes.MESSAGE_RESPONSE_SUCCESS ];
}

const create_testimonials_controller = async (filter_body) => {
    const testimonials = new testimonials_model(filter_body);

    return await testimonials.save().then(() => { 
            return [ testimonials_utils.filter_testimonials_object(testimonials), 
                     response_codes.CODE_RESPONSE_CREATION_SUCCESS, 
                     response_codes.MESSAGE_RESPONSE_CREATION_SUCCESS ];
        }).catch(() => {
            return [ null,
                     response_codes.CODE_INTERNAL_SERVER_ERROR,
                     response_codes.MESSAGE_RESPONSE_INTERNAL_SERVER_ERROR ];
        });
}


const edit_testimonials_controller = async (filter_params, filter_body) => {
    if (!filter_params.id)
        return [ null, 
                 response_codes.CODE_BAD_REQUEST, 
                 response_codes.MESSAGE_MISSING_PARAMETERS + "id" ];

    
    if (!common_utils.validate_id(filter_params.id)) 
        return [ null, 
                 response_codes.CODE_BAD_REQUEST, 
                 response_codes.MESSAGE_INVALID_PARAMETERS + "id" ];

    const testimonials = await testimonials_model.findOneAndUpdate(
        { _id: filter_params.id, }, filter_body, { returnDocument: "after" });

    return [ testimonials_utils.filter_testimonials_object(testimonials), 
             response_codes.CODE_RESPONSE_SUCCESS, 
             response_codes.MESSAGE_RESPONSE_SUCCESS ];
}


const remove_testimonials_controller = async (filter_body) => {
    if (!common_utils.validate_id(filter_body.id)) 
        return [ null, 
                 response_codes.CODE_BAD_REQUEST, 
                 response_codes.MESSAGE_INVALID_PARAMETERS + "id" ];

    const testimonials = await testimonials_model.findOneAndUpdate(
        { _id: filter_body.id }, { status: false }, { returnDocument: "after" });

    return [ testimonials_utils.filter_testimonials_object(testimonials), 
             response_codes.CODE_RESPONSE_SUCCESS, 
             response_codes.MESSAGE_RESPONSE_SUCCESS ];
}


module.exports = {
    read_testimonials_controller,
    create_testimonials_controller,
    edit_testimonials_controller,
    remove_testimonials_controller
}
