import {z, type ZodType} from "zod";
import {orderFields, productFields} from "./fields";

export class OrderValidation {
    static readonly BARCODE: ZodType = productFields.barcode;

    static readonly UPDATE: ZodType = z.object({
        paymentMethod: orderFields.paymentMethod,
        paymentStatus: orderFields.paymentStatus,
        quantity: orderFields.quantity
    });

    static readonly ORDER_ID: ZodType = productFields.id;
}