import {z, ZodType} from "zod";
import {productFields} from "../../../validations/fields";

export class ProductValidation {
    static readonly CREATE: ZodType = z.object({
        name: productFields.name,
        brand: productFields.brand,
        price: productFields.price,
        stock: productFields.stock,
        barcode: productFields.barcode,
    });

    static readonly GET: ZodType = productFields.id;

    static readonly UPDATE: ZodType = z.object({
        name: productFields.name,
        brand: productFields.brand,
        price: productFields.price,
        stock: productFields.stock,
    });

    static readonly LIST: ZodType = z.object({
        name: productFields.optionalName,
        brand: productFields.optionalBrand,
        page: productFields.page,
        size: productFields.size
    })
}