import type {ApiResponse, GetUserRequestId, UserRequest} from "../types/user-models";
import type {Request, Response, NextFunction} from "express";
import type {OrderId, OrderResponse, ScanBarcode, UpdateOrderRequest} from "../types/order-models";
import {OrderService} from "../services/order-service";

export class OrderControllers {
    static async createOrder(req: UserRequest, res: Response<ApiResponse<OrderResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const id: GetUserRequestId = req.user!._id;
            const { barcode } = req.body as { barcode: ScanBarcode };
            const response: OrderResponse = await OrderService.createOrder(barcode, id);
            return res.status(201).json({
                success: true,
                message: 'Create order successfully',
                data: response,
                errors: null
            });
        } catch (e) {
            next(e);
        }
    }

    static async updateOrder(req: Request, res: Response<ApiResponse<OrderResponse>>, next: NextFunction): Promise<Response | void> {
        try {
            const { id = '' } = req.params;
            const request: UpdateOrderRequest = req.body as UpdateOrderRequest;
            const response: OrderResponse = await OrderService.updateOrder(request, id);
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
    }
}