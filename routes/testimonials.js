/* Node Imports */


/* Framework Imports */
var express = require('express');
var router = express.Router();

/* Local Imports */
var common_utils = require("../utils/common_utils");
var constants = require("../utils/constants");
var testimonials_controller = require('../controller/testimonials_controller');
const response_codes = require('../utils/response_codes');
const testimonials_utils = require('../utils/testimonials_utils');

/* Middleware Imports */
const jwt_authentication = require("../middleware/jwt_authentication");
const request_validation = require("../middleware/request_validation");


/* GET: all testimonials. */
const get_all_testimonials = async (req, res, next) => {
    const [ testimonials, response_code, response_message ] = await testimonials_controller.read_testimonials_controller({});
    if (response_code != response_codes.CODE_RESPONSE_SUCCESS) {
        return res.status(response_code).send(common_utils.response_generator(
            response_code, 
            response_message
        ));
    }
    return res.status(response_code).send(common_utils.response_generator(
            response_code, 
            response_message, 
            response_data={testimonials}
            ));
}

router.get('/', async (req, res, next) => {
    // Send all testimonials from database with limited fields
    await common_utils.api_error_handler(req, res, next, get_all_testimonials);
});


/* GET: single testimonials in detail. */
const get_single_testimonials = async (req, res, next) => {
    const [ testimonials, response_code, response_message ] = await testimonials_controller.read_testimonials_controller(req.params);
    if (response_code != response_codes.CODE_RESPONSE_SUCCESS) {
        return res.status(response_code).send(common_utils.response_generator(
            response_code, 
            response_message
        ));
    }
    return res.status(response_code).send(common_utils.response_generator(
            response_code, 
            response_message, 
            response_data={testimonials}
            ));
}

router.get('/:id', async (req, res, next) => {
    // Send testimonials from database with all required fields
    await common_utils.api_error_handler(req, res, next, get_single_testimonials);
});


/* POST: Create a testimonials. */
const create_testimonials = async (req, res, next) => {
    const [ testimonials, response_code, response_message ] = await testimonials_controller.create_testimonials_controller(req.body);
    if (response_code != response_codes.CODE_RESPONSE_CREATION_SUCCESS) {
        return res.status(response_code).send(common_utils.response_generator(
            response_code, 
            response_message
        ));
    }
    return res.status(response_code).send(common_utils.response_generator(
            response_code, 
            response_message, 
            response_data={testimonials}
            ));
}

router.post('/', 
    [ jwt_authentication.verify_token,
      jwt_authentication.is_authentic_role([ constants.ADMIN ]),
      request_validation.request_validator(testimonials_utils.testimonials_validation) ], 
    async (req, res, next) => {
        // Create a testimonials
        await common_utils.api_error_handler(req, res, next, create_testimonials);
});


/* PUT: Update a testimonials. */
const edit_testimonials = async (req, res, next) => {
    const [ testimonials, response_code, response_message ] = await testimonials_controller.edit_testimonials_controller(req.params, req.body);
    if (response_code != response_codes.CODE_RESPONSE_SUCCESS) {
        return res.status(response_code).send(common_utils.response_generator(
            response_code, 
            response_message
        ));
    }
    return res.status(response_code).send(common_utils.response_generator(
            response_code, 
            response_message, 
            response_data={testimonials}
            ));
}

router.put('/:id', 
    [ jwt_authentication.verify_token,
      jwt_authentication.is_authentic_role([ constants.ADMIN ]),
      request_validation.request_validator(testimonials_utils.testimonials_update_validation) ],
    async (req, res, next) => {
        // Update a testimonials in database
        await common_utils.api_error_handler(req, res, next, edit_testimonials);
});


/* DELETE: Delete a testimonials member. */
const remove_testimonials = async (req, res, next) => {
    const [ testimonials, response_code, response_message ] = await testimonials_controller.remove_testimonials_controller(req.params);
    if (response_code != response_codes.CODE_RESPONSE_SUCCESS) {
        return res.status(response_code).send(common_utils.response_generator(
            response_code, 
            response_message
        ));
    }
    return res.status(response_code).send(common_utils.response_generator(
            response_code, 
            response_message
            ));
}

router.delete('/:id',
    [ jwt_authentication.verify_token,
      jwt_authentication.is_authentic_role([ constants.ADMIN ]) ],
    async (req, res, next) => {
        // Remove a testimonials in database
        await common_utils.api_error_handler(req, res, next, remove_testimonials);
});


module.exports = router;
