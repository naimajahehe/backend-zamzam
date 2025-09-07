import type {OrderId, OrderResponse, ScanBarcode, UpdateOrderRequest} from "../types/order-models";
import {Validation} from "../validations/validation";
import {OrderValidation} from "../validations/order-validation";
import Product from "../models/product";
import {ResponseError} from "../errors/response-error";
import type {GetUserRequestId} from "../types/user-models";
import Order from "../models/order";
import {UserValidation} from "../validations/user-validation";
import {AuthService} from "./auth-service";
import {orderResponse} from "../responses/order-response";

export class OrderService {
    static async createOrder(barcode: ScanBarcode, id: GetUserRequestId): Promise<OrderResponse> {
        const validateBarcode: ScanBarcode = Validation.validate(OrderValidation.BARCODE, barcode);
        const validateUserId: GetUserRequestId = Validation.validate(UserValidation.ID, id);

        const user = await AuthService.getUserById(validateUserId);
        const findProduct = await Product.findOne({
            barcode: validateBarcode
        });
        if ( !findProduct ) throw new ResponseError(400, 'Product not found');
        if ( findProduct.stock <= 0 ) throw new ResponseError(400, 'Product is out of stock');

        const findOrder = await Order.findOne({
            "products.product" : findProduct._id,
            user: validateUserId,
            orderStatus: 'pending'
        });
        if (findOrder) throw new ResponseError(400, `This product is already in a pending order, id: ${findOrder._id}`);

        const newOrder = new Order({
            user: user._id,
            products: {
                product: findProduct._id,
                price: findProduct.price
            },
            totalPrice: findProduct.price
        })

        findProduct.stock -= 1;
        await newOrder.save();
        await findProduct.save();

        const order = await newOrder.populate({
            path: 'products.product',
            select: 'name brand price barcode stock'
        });
        return orderResponse(order);
    };

    static async updateOrder(request: UpdateOrderRequest, id: OrderId): Promise<OrderResponse> {
        const validateOrder: UpdateOrderRequest = Validation.validate(OrderValidation.UPDATE, request);
        const validateOrderId: OrderId = Validation.validate(OrderValidation.ORDER_ID, id);

        const findOrder = await Order.findById(validateOrderId);
        if (!findOrder) throw new ResponseError(404, 'Order product not found');
        if (findOrder.isCompleted) throw new ResponseError(400, 'Order product was completed');

        const findProduct = await Product.findById(findOrder.products.product._id);
        if (!findProduct) throw new ResponseError(404, 'Product not found');

        const diff: number = validateOrder.quantity - findOrder.products.quantity;
        if (diff > 0 && diff > findProduct.stock) throw new ResponseError(400, 'Not enough stock to increase quantity');

        if (validateOrder.paymentStatus === 'paid') {
            findOrder.orderStatus = 'completed'
            findOrder.isCompleted = true;
            findOrder.paymentDate = new Date();
        }

        findProduct.stock -= diff;
        findOrder.products.quantity = validateOrder.quantity;
        findOrder.totalPrice = findOrder.products.price * validateOrder.quantity;
        findOrder.paymentMethod = validateOrder.paymentMethod;

        await findProduct.save();
        await findOrder.save();

        const order = await findOrder.populate({
            path: 'products.product',
            select: 'name brand price stock barcode'
        })

        return orderResponse(order);
    };

    static async getOrder(orderId: OrderId): Promise<OrderResponse> {
        const validateOrderId = Validation.validate(OrderValidation.ORDER_ID, orderId);
        const order = await Order.findById(validateOrderId).populate({
            path: 'products.product',
            select: 'name brand stock price barcode'
        });

        if (!order) throw new ResponseError(404, 'Order not found');
        return orderResponse(order);
    }
}