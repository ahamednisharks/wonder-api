import Joi from 'joi';

export const BillingValidationSchema = (schemaType: string, data: any) => {
    let schema: any = {};

    switch (schemaType) {

        case "create":
            schema = {
                items: Joi.array().items(
                    Joi.object({
                        id: Joi.number().required(),
                        name: Joi.string().trim().min(1).required(),
                        qty: Joi.number().min(1).required(),
                        price: Joi.number().precision(2).min(0).required(),
                        total: Joi.number().precision(2).min(0).required()
                    })
                ).min(1).required(),

                subtotal: Joi.number().precision(2).min(0).required(),
                discount: Joi.number().precision(2).min(0).allow(0),
                total: Joi.number().precision(2).min(0).required(),

                paymentMode: Joi.string()
                    .valid('Cash', 'UPI', 'Card')
                    .required(),

                amountPaid: Joi.number().precision(2).min(0).required(),
                balance: Joi.number().precision(2).required()
            };
            break;

        case "get":
        case "delete":
            schema = {
                billID: Joi.number().min(1).required()
            };
            break;

        case "list":
            schema = {
                fromDate: Joi.date().optional(),
                toDate: Joi.date().optional(),
                paymentMode: Joi.string().valid('Cash', 'UPI', 'Card').optional()
            };
            break;
    }

    const { error } = Joi.object(schema).validate(data, {
        abortEarly: false,
        convert: true
    });

    return error;
};
