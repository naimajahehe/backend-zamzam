import type {ApiResponse, GetUserRequestId, UserEmail, UserRequest} from "../../../types/user.types";
import type {Request, Response, NextFunction} from "express";
import type {
    ListOrderRequest,
    ListOrderResponse,
    OrderId,
    OrderIdResponse,
    OrderResponse,
    ScanBarcode,
    UpdateOrderRequest
} from "../../../types/order.types";
import {OrderService} from "../services/order-service";
import type {Pageable} from "../../../types/page";

export class OrderController {
    static async createOrder(req: UserRequest, res: Response<ApiResponse<OrderIdResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const id: GetUserRequestId = req.user!._id;
            const { barcode } = req.body as { barcode: ScanBarcode };
            const response: OrderIdResponse = await OrderService.createOrder(barcode, id);
            return res.status(201).json({
                success: true,
                message: 'Create order successfully',
                data: response,
                errors: null
            });
        } catch (e) {
            next(e);
        }
    };

    static async getOrder(req: Request, res: Response<ApiResponse<OrderResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const { id = '' } = req.params as { id : OrderId };
            const response: OrderResponse = await OrderService.getOrder(id);
            return res.status(200).json({
                success: true,
                message: 'Get order successfully',
                data: response,
                errors: null
            });
        } catch (e) {
            next(e);
        }
    };

    static async addProductOrder(req: Request, res: Response<ApiResponse<OrderIdResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const { id, barcode } = req.body as {id: OrderId, barcode: ScanBarcode};
            const response: OrderIdResponse = await OrderService.addProductOrder(barcode, id);
            return res.status(200).json({
                success: true,
                message: 'Add product order successfully',
                data: response,
                errors: null
            })
        } catch (e) {
            next(e);
        }
    }

    static async updateOrder(req: Request, res: Response<ApiResponse<OrderIdResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const { id = '' } = req.params;
            const request: UpdateOrderRequest = req.body as UpdateOrderRequest;
            const response: OrderIdResponse = await OrderService.updateOrder(request, id);
            return res.status(200).json({
                success: true,
                message: 'Update order successfully',
                data: response,
                errors: null
            });
        } catch (e) {
            next(e);
        }
    };

    static async cancelOrder(req: Request, res: Response<ApiResponse<OrderIdResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const { id = '' } = req.params as { id: OrderId };
            const response: OrderIdResponse = await OrderService.cancelOrder(id);
            return res.status(200).json({
                success: true,
                message: 'Cancel order successfully',
                data: response,
                errors: null
            })
        } catch (e) {
            next(e);
        }
    }

    static async listOrder(req: Request, res: Response<ApiResponse<Array<ListOrderResponse>>>, next: NextFunction): Promise<Response | void> {
        try {
            const { search, page, size } = req.query;
            const request: ListOrderRequest = {
                ...(search ? {search: String(search)} : {}),
                page: page ? Number(page) : 1,
                size: size ? Number(size) : 10
            }
            const response: Pageable<ListOrderResponse> = await OrderService.listOrder(request);
            return res.status(200).json({
                success: true,
                message: 'Get list of order successfully',
                data: response.data,
                errors: null,
                paging: response.paging
            })

        } catch (e) {
            next(e);
        }
    };

    static async deleteOrder(req: Request, res: Response<ApiResponse<null>>, next:NextFunction): Promise<Response | void> {
        try {
            const { id = '' } = req.params as { id: OrderId };
            await OrderService.deleteOrder(id);
            return res.status(200).json({
                success: true,
                message: 'Delete order successfully',
                data: null,
                errors: null
            })
        } catch (e) {
            next(e);
        }
    };

    static async printReceipt(req: Request, res: Response<ApiResponse<OrderIdResponse>>, next:NextFunction): Promise<Response | void> {
        try {
            const { id = '' } = req.params as { id: OrderId };
            const { email } = req.body as { email: UserEmail };
            const response: OrderIdResponse = await OrderService.printReceipt(id, email);
            return res.status(200).json({
                success: true,
                message: 'Print receipt successfully',
                data: response,
                errors: null
            })
        } catch (e) {
            next(e);
        }
    }
}