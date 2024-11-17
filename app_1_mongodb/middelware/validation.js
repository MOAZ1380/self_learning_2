const { body } = require('express-validator');


const validayionSchema = () => {
    return [
        body('title')
            .notEmpty()
            .withMessage('title is required')
            .isLength({ min: 2 }),
        body('price')
            .isLength({ min: 2 })
            .withMessage('price is required')
    ];
}

module.exports = {
    validayionSchema
};
