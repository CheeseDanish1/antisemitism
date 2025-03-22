const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const formattedErrors = errors.array().map(error => ({
        field: error.param,
        message: `${error.msg}: ${error.path}`,
        value: error.value,
        location: error.location
    }));

    return res.status(400).json({
        success: false,
        errors: formattedErrors,
        message: 'Validation failed. Please check the request parameters.'
    });
};

module.exports = validateRequest;