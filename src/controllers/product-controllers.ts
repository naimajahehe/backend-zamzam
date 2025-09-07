import type {Request, Response, NextFunction } from "express";
import type {ApiResponse, GetUserRequestId, UserRequest} from "../types/user-models";
import type {
    CreateProductRequest,
    ListProductRequest,
    ProductResponse,
    UpdateProductRequest
} from "../types/product-models";
import { ProductService } from "../services/product-service";
import type {Pageable} from "../types/page";

export class ProductControllers {
    static async create(req: UserRequest, res: Response<ApiResponse<ProductResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const request: CreateProductRequest = req.body as CreateProductRequest;
            const id: GetUserRequestId = req.user!._id;
            const response: ProductResponse = await ProductService.create(request, id);

            return res.status(201).json({
                success: true,
                message: "Product created successfully",
                data: response,
                errors: null,
            });
        } catch (e) {
            next(e);
        }
    }

    static async get(req: Request, res: Response<ApiResponse<ProductResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const { id = '' } = req.params;
            const response: ProductResponse = await ProductService.get(id!);
            return res.status(200).json({
                success: true,
                message: 'Get product successfully',
                data: response,
                errors: null
            })
        } catch (e) {
            next(e);
        }
    }

    static async update(req: Request, res: Response<ApiResponse<ProductResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const { id = '' } = req.params;
            const request: UpdateProductRequest = req.body as UpdateProductRequest;
            const response: ProductResponse = await ProductService.update(request, id);
            return res.status(200).json({
                success: true,
                message: 'Update product successfully',
                data: response,
                errors: null
            })
        } catch (e) {
            next(e);
        }
    }

    static async delete(req: Request, res: Response<ApiResponse<ProductResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const { id = '' } = req.params;
            const response: ProductResponse = await ProductService.delete(id);
            return res.status(200).json({
                success: true,
                message: 'Product deleted successfully',
                data: response,
                errors: null
            })
        } catch (e) {
            next(e);
        }
    }

    static async list(req: Request, res: Response<ApiResponse<Array<ProductResponse>>>, next: NextFunction): Promise<Response | void> {
        try {
            const { name, brand, page, size } = req.query;
            const request: ListProductRequest = {
                ...(name ? {name: String(name)} : {}),
                ...(brand ? {brand: String(brand)} : {}),
                page: page ? Number(page) : 1,
                size: size ? Number(size) : 10
            }
            const response:Pageable<ProductResponse> = await ProductService.list(request);
            return res.status(200).json({
                success: true,
                message: 'Product list successfully',
                data: response.data,
                errors: null,
                paging: response.paging
            })
        } catch (e) {
            next(e);
        }
    }
}
