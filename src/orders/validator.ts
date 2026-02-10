import Joi from "joi";

export const OrdersValidationSchema = (type: string, data: any) => {
    let schema: any = {};

    switch (type) {

        case "create":
            schema = {
                customerName: Joi.string().required(),
                customerPhone: Joi.string().required(),
                customerAltPhone: Joi.string().allow("", null),

                deliveryDateTime: Joi.date().required(),
                deliveryLocationType: Joi.string().valid("SHOP", "OTHERS").required(),
                deliveryAddress: Joi.when("deliveryLocationType", {
                    is: "OTHERS",
                    then: Joi.string().required(),
                    otherwise: Joi.allow("", null)
                }),

                deliveryCharge: Joi.number().min(0).allow(0),
                discount: Joi.number().min(0).allow(0),
                advanceAmount: Joi.number().min(0).allow(0),
                paymentAmount: Joi.number().min(0).allow(0),

                items: Joi.array().items(
                    Joi.object({
                        itemId: Joi.number().required(),
                        category: Joi.string().allow("", null),
                        unit: Joi.string().allow("", null),
                        quantity: Joi.number().min(1).required(),   // ✅ FIXED
                        price: Joi.number().min(0).required(),
                        notes: Joi.string().allow("", null),
                        designFile: Joi.any().optional()
                    })
                ).min(1).required()
            };
            break;


        case "get":
        case "delete":
            schema = {
                orderId: Joi.string().uuid().required()
            };
            break;

        case "list":
            schema = {
                search: Joi.string().optional(),
                status: Joi.string().valid("Pending", "Delivered", "Cancelled").optional(),
                fromDate: Joi.date().optional(),
                toDate: Joi.date().optional()
            };
            break;
    }

    const { error } = Joi.object(schema).validate(data, {
        abortEarly: false,
        convert: true
    });

    return error;
};
