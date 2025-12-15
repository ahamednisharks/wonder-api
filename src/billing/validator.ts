export const BillingValidationSchema = (schemaType: string, Joi: any) => {
    const schema: any = {};

    switch (schemaType) {

        // -------------------------
        // CREATE BILL
        // -------------------------
        case "create":

            schema.items = Joi.array().items(
                Joi.object({
                    id: Joi.number().required(),
                    name: Joi.string().trim().min(1).required(),
                    qty: Joi.number().min(1).required(),
                    price: Joi.number().precision(2).min(0).required(),
                    total: Joi.number().precision(2).min(0).required()
                })
            ).min(1).required();

            schema.subtotal = Joi.number().precision(2).min(0).required();
            schema.discount = Joi.number().precision(2).min(0).allow(null, 0);
            schema.total = Joi.number().precision(2).min(0).required();

            schema.paymentMode = Joi.string()
                .trim()
                .valid('Cash', 'UPI', 'Card')
                .required();

            schema.amountPaid = Joi.number().precision(2).min(0).required();
            schema.balance = Joi.number().precision(2).required();

            break;

        // -------------------------
        // GET BILL BY ID
        // -------------------------
        case "get":
            schema.billID = Joi.number().min(1).required();
            break;

        // -------------------------
        // DELETE BILL
        // -------------------------
        case "delete":
            schema.billID = Joi.number().min(1).required();
            break;

        // -------------------------
        // LIST BILLS (FILTER)
        // -------------------------
        case "list":
            schema.fromDate = Joi.date().optional();
            schema.toDate = Joi.date().optional();
            schema.paymentMode = Joi.string()
                .valid('Cash', 'UPI', 'Card')
                .optional();
            break;
    }

    return Joi.object(schema);
};
