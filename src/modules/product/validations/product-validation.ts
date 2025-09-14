import {z, ZodType} from "zod";
import {fields, productFields} from "../../../validations/fields";

export class ProductValidation {
    static readonly CREATE: ZodType = z.object({
        name: productFields.name,
        brand: productFields.brand,
        price: productFields.price,
        stock: productFields.stock,
        barcode: productFields.barcode,
    });

    static readonly ID: ZodType = fields.id;

    static readonly UPDATE: ZodType = z.object({
        name: productFields.name,
        brand: productFields.brand,
        price: productFields.price,
        stock: productFields.stock,
    });

    static readonly LIST: ZodType = z.object({
        search: productFields.optionalName,
        page: productFields.page,
        size: productFields.size
    })
}