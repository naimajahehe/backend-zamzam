import type {
    CreateProductRequest,
    GetProductRequestId, ListProductRequest,
    ProductResponse,
    UpdateProductRequest
} from "../../../types/product-models";
import {Validation} from "../../../validations/validation";
import {ProductValidation} from "../validations/product-validation";
import Product from "../models/product";
import type {GetUserRequestId} from "../../../types/user-models";
import {UserValidation} from "../../user/validations/user.validation";
import {productResponse} from "../responses/product-response";
import {ResponseError} from "../../../errors/response-error";
import mongoose from "mongoose";
import type {Pageable} from "../../../types/page";

export class ProductService {
    static async create(request: CreateProductRequest, id: GetUserRequestId): Promise<ProductResponse> {
        const productRequest: CreateProductRequest = Validation.validate(ProductValidation.CREATE, request);
        const userId: GetUserRequestId = Validation.validate(UserValidation.ID, id);

        const isMatchBarcode = await Product.findOne({barcode: productRequest.barcode});
        if (isMatchBarcode) throw new ResponseError(400, 'The same barcode has already been entered');

        const product = new Product({
            name: productRequest.name,
            brand: productRequest.brand,
            price: productRequest.price,
            stock: productRequest.stock,
            barcode: productRequest.barcode,
            owner: userId.id,
        })
        await product.save();
        return productResponse(product);
    }

    static async get(id: GetProductRequestId): Promise<ProductResponse> {
        const productRequestId: GetProductRequestId = Validation.validate(ProductValidation.GET, id);

        const productItem = await Product.findById(productRequestId);
        if (!productItem) {
            throw new ResponseError(404, 'Product not found');
        }

        return productResponse(productItem)
    }

    static async update(request: UpdateProductRequest, id: GetProductRequestId): Promise<ProductResponse> {
        const productRequest: UpdateProductRequest = Validation.validate(ProductValidation.UPDATE, request);
        const productId: GetProductRequestId = Validation.validate(ProductValidation.GET, id);

        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            name: productRequest.name,
            brand: productRequest.brand,
            price: productRequest.price,
            stock: productRequest.stock,
        }, {
            new: true
        })

        if (!updatedProduct) throw new ResponseError(404, 'Product not found');

        return productResponse(updatedProduct);
    }

    static async delete(id: GetProductRequestId): Promise<ProductResponse> {
        const deleteId: GetProductRequestId = Validation.validate(ProductValidation.GET, id);
        const deleteProduct = await Product.findByIdAndDelete(deleteId)

        if (!deleteProduct) {
            throw new ResponseError(404, 'Product not found');
        }

        return productResponse(deleteProduct)
    }

    static async list(request: ListProductRequest): Promise<Pageable<ProductResponse>> {
        const listRequest: ListProductRequest = Validation.validate(ProductValidation.LIST, request);
        const skip = (listRequest.page - 1) * listRequest.size;

        const filter = []
        if (listRequest.name) {
            filter.push({name: {$regex: `^${listRequest.name}`, $options: 'i'}});
        }
        if (listRequest.brand) {
            filter.push({brand: {$regex: `^${listRequest.brand}`, $options: 'i'}});
        }
        const condition = filter.length > 0 ? {$or: filter} : {};

        const [products, total] = await Promise.all([
            Product.find(condition).skip(skip).limit(listRequest.size).sort({createdAt: -1}),
            Product.countDocuments(condition)
        ])

        return {
            data: products.map(item => productResponse(item)),
            paging: {
                size: listRequest.size,
                total_page: Math.ceil(total / listRequest.size),
                current_page: listRequest.page
            }
        }
    }
}