import type {
    CreateProductRequest,
    ListProductRequest,
    ProductResponse,
    UpdateProductRequest
} from "../../../types/product.types";
import {Validation} from "../../../validations/validation";
import {ProductValidation} from "../validations/product-validation";
import ProductModel from "../models/product.model";
import {listProductResponse, productResponse} from "../responses/product-response";
import {ResponseError} from "../../../errors/response-error";
import type {Pageable} from "../../../types/common.types";

export class ProductService {
    static async create(request: CreateProductRequest, id: string): Promise<ProductResponse> {
        const productRequest: CreateProductRequest = Validation.validate(ProductValidation.CREATE, request);
        const userId: string = Validation.validate(ProductValidation.ID, id);

        const exists = await ProductModel.exists({barcode: productRequest.barcode});
        if (exists) throw new ResponseError(400, 'The same barcode has already been entered');

        const product = new ProductModel({
            ...productRequest,
            owner: userId,
        })
        await product.save();
        return productResponse(product);
    }

    static async get(id: string): Promise<ProductResponse> {
        const productRequestId: string = Validation.validate(ProductValidation.ID, id);

        const productItem = await ProductModel.findById(productRequestId);
        if (!productItem) {
            throw new ResponseError(404, 'Product not found');
        }

        return productResponse(productItem);
    }

    static async update(request: UpdateProductRequest, id: string): Promise<ProductResponse> {
        const productRequest: UpdateProductRequest = Validation.validate(ProductValidation.UPDATE, request);
        const productId: string = Validation.validate(ProductValidation.ID, id);

        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, {
            name: productRequest.name,
            brand: productRequest.brand,
            price: productRequest.price,
            stock: productRequest.stock,
        }, {
            new: true
        });

        if (!updatedProduct) throw new ResponseError(404, 'Product not found');

        return productResponse(updatedProduct);
    }

    static async delete(id: string): Promise<ProductResponse> {
        const deleteId: string = Validation.validate(ProductValidation.ID, id);
        const deleteProduct = await ProductModel.findByIdAndDelete(deleteId)

        if (!deleteProduct) {
            throw new ResponseError(404, 'Product not found');
        }

        return productResponse(deleteProduct)
    }

    static async list(request: ListProductRequest): Promise<Pageable<ProductResponse>> {
        const listRequest: ListProductRequest = Validation.validate(ProductValidation.LIST, request);
        const skip = (listRequest.page - 1) * listRequest.size;

        const filter: any = {}
        if (listRequest.search) {
            filter.$or = [
                {name: {$regex: `^${listRequest.search}`, $options: 'i'}},
                {brand: {$regex: `^${listRequest.search}`, $options: 'i'}},
                {barcode: {$regex: `^${listRequest.search}`, $options: 'i'}}
            ];
        }

        const [products, total] = await Promise.all([
            ProductModel.find(filter).skip(skip).limit(listRequest.size).sort({createdAt: -1}),
            ProductModel.countDocuments(filter)
        ])

        return listProductResponse(products, listRequest.size, total, listRequest.page);
    }
}