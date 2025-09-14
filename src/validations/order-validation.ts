import {z, type ZodType} from "zod";
import {orderFields, productFields, userFields} from "./fields";

export class OrderValidation {
    static readonly BARCODE: ZodType = productFields.barcode;

    static readonly UPDATE: ZodType = z.object({
        paymentMethod: orderFields.paymentMethod,
        paymentStatus: orderFields.paymentStatus,
        products: orderFields.products
    });

    static readonly ORDER_ID: ZodType = userFields.id;

    static readonly LIST: ZodType = z.object({
        search: productFields.optionalName,
        page: productFields.page,
        size: productFields.size
    });

    static readonly EMAIL: ZodType = z.email('Masukkan email yang valid')
}