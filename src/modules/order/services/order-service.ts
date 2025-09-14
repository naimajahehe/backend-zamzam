import type {
    ListOrderRequest, ListOrderResponse,
    OrderId,
    OrderIdResponse, OrderProducts,
    OrderResponse,
    ScanBarcode, UpdateOrderRequest,
} from "../../../types/order.types";
import {Validation} from "../../../validations/validation";
import {OrderValidation} from "../validations/order-validation";
import ProductModel from "../../product/models/product.model";
import {ResponseError} from "../../../errors/response-error";
import type {GetUserRequestId} from "../../../types/user.types";
import Order from "../models/order";
import {UserValidation} from "../../user/validations/user.validation";
import {AuthService} from "../../auth/services/auth.service";
import {getOrderResponse, listOrderResponse, orderIdResponse} from "../responses/order-response";
import type {Pageable} from "../../../types/page";
import {Nodemailer} from "../../../utils/nodemailer";

export class OrderService {
    static async getOrderById(id: OrderId) {
        const order = await Order.findById(id);
        if (!order) throw new ResponseError(404, 'Order not found');
        return order;
    }

    static async createOrder(barcode: ScanBarcode, id: GetUserRequestId): Promise<OrderIdResponse> {
        const validateBarcode: ScanBarcode = Validation.validate(OrderValidation.BARCODE, barcode);
        const validateUserId: GetUserRequestId = Validation.validate(UserValidation.ID, id);

        const user = await AuthService.getUserById(validateUserId);
        const findProduct = await ProductModel.findOne({
            barcode: validateBarcode
        });
        if ( !findProduct )
            throw new ResponseError(400, 'Product not found');
        if ( findProduct.stock <= 0 )
            throw new ResponseError(400, 'Product is out of stock');

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

        return orderIdResponse(newOrder);
    };

    static async getOrder(orderId: OrderId): Promise<OrderResponse> {
        const validateOrderId = Validation.validate(OrderValidation.ORDER_ID, orderId);
        const order = await Order.findById(validateOrderId).populate({
            path: 'products.product',
            select: 'name brand stock price barcode'
        });
        if (!order) throw new ResponseError(404, 'Order not found');
        return getOrderResponse(order);
    };

    static async addProductOrder(barcode: ScanBarcode, id: OrderId): Promise<OrderIdResponse> {
        const validateBarcode: ScanBarcode = Validation.validate(OrderValidation.BARCODE, barcode);
        const validateOrderId: OrderId = Validation.validate(OrderValidation.ORDER_ID, id);

        const product = await ProductModel.findOne({barcode: validateBarcode});
        if (!product) throw new ResponseError(404, 'Product not found');
        if (product.stock === 0) throw new ResponseError(400, 'Not enough stock');

        const order = await this.getOrderById(validateOrderId);
        const checkOrder = order.products.some(
            item => item.product.toString() === product._id.toString()
        );
        if (checkOrder) throw new ResponseError(400, 'Product already in order');

        if (order.products.length > 20) throw new ResponseError(400, 'Maximum 20 products per order')

        if (order.isCompleted || order.orderStatus === 'completed')
            throw new ResponseError(400, 'This order is completed');

        order.products.push({
            product: product._id,
            quantity: 1,
            price: product.price
        });
        product.stock -= 1;
        await order.save();
        await product.save();

        return orderIdResponse(order);
    }

    /*
    ###REQUEST###
    {
      "paymentMethod": "cash",
      "paymentStatus": "unpaid",
      "products": [
        { "product": "66e12ab...", "quantity": 2, "price": 10000 },
        { "product": "66e12cd...", "quantity": 5, "price": 15000 }
      ]
    }
     */
    static async updateOrder(request: UpdateOrderRequest, id: OrderId): Promise<OrderIdResponse> {
        const validateOrder: UpdateOrderRequest = Validation.validate(OrderValidation.UPDATE, request);
        const validateOrderId: OrderId = Validation.validate(OrderValidation.ORDER_ID, id);

        const order = await Order.findById(validateOrderId);
        if (!order) throw new ResponseError(404, 'Order product not found');
        if (order.isCompleted) throw new ResponseError(400, 'Order product was completed');

        let totalPrice: number = 0;
        for (let updatedProduct of validateOrder.products as Array<OrderProducts>) {
            const findProduct = await ProductModel.findById(updatedProduct.product);
            if (!findProduct) throw new ResponseError(404, 'Product not found');

            for (let orderProducts of order.products as Array<OrderProducts>) {
                if (orderProducts.product.toString() === updatedProduct.product.toString()) {
                    const diff: number = updatedProduct.quantity - orderProducts.quantity;
                    if (diff > 0 && diff > findProduct.stock)
                        throw new ResponseError(400, 'Not enough stock to increase quantity');
                    findProduct.stock = findProduct.stock - diff;
                    orderProducts.quantity = updatedProduct.quantity;
                    totalPrice += orderProducts.price * updatedProduct.quantity;
                    break;
                }
            }

            await findProduct.save();
        }

        if (validateOrder.paymentStatus === 'paid') {
            order.orderStatus = 'completed';
            order.isCompleted = true;
            order.paymentDate = new Date();
            order.paymentStatus = 'paid';
        } else {
            order.paymentStatus = validateOrder.paymentStatus;
        }

        order.totalPrice = totalPrice;
        order.paymentMethod = validateOrder.paymentMethod;
        await order.save();

        return orderIdResponse(order);
    };

    static async cancelOrder(orderId: OrderId): Promise<OrderIdResponse> {
        const validateOrderId = Validation.validate(OrderValidation.ORDER_ID, orderId);
        const order = await Order.findById(validateOrderId);
        if (!order) throw new ResponseError(404, 'Order not found');
        if (order.orderStatus === 'canceled') throw new ResponseError(400, 'Product was already canceled');

        for (let orderProducts of order.products as Array<OrderProducts>) {
            const product = await ProductModel.findById(orderProducts.product);
            if (!product) throw new ResponseError(404, 'Product not found');

            product.stock += orderProducts.quantity;
            await product.save();
        }

        order.orderStatus = 'canceled';
        await order.save();

        return orderIdResponse(order);
    };

    static async listOrder(request: ListOrderRequest): Promise<Pageable<ListOrderResponse>> {
        const listRequest: ListOrderRequest = Validation.validate(OrderValidation.LIST, request);
        const skip = (listRequest.page - 1) * listRequest.size;

        const filter: any = {};
        if (listRequest.search !== undefined) {
            filter['_id'] = listRequest.search
        }

        const [orders, total] = await Promise.all([
            Order.find(filter).skip(skip).limit(listRequest.size).sort({createdAt: -1}),
            Order.countDocuments(filter)
        ])

        return listOrderResponse(orders, total, listRequest.size, listRequest.page);
    };

    static async deleteOrder(orderId: OrderId): Promise<void> {
        const validateOrderId: OrderId = Validation.validate(OrderValidation.ORDER_ID, orderId);
        const order = await Order.findById(validateOrderId);
        if (!order) throw new ResponseError(404, 'Order not found');

        for (let productsOrder of order.products as Array<OrderProducts>) {
            const product = await ProductModel.findById(productsOrder.product);
            if (!product) throw new ResponseError(404, 'Product not found');

            product.stock += productsOrder.quantity;
            await product.save();
        }

        await Order.findByIdAndDelete(validateOrderId);
    };

    static async printReceipt(orderId: OrderId, email: string): Promise<OrderIdResponse> {
        const validateOrderId: OrderId = Validation.validate(OrderValidation.ORDER_ID, orderId);
        const validateEmail = Validation.validate(OrderValidation.EMAIL, email);
        const order = await Order.findById(validateOrderId);
        if (!order) throw new ResponseError(404, 'Order not found');
        if (!order.isCompleted)
            throw new ResponseError(400, 'Cannot print receipt for an incomplete order');

        if (order.orderStatus === 'canceled')
            throw new ResponseError(400, 'Cannot print receipt then order is canceled');

        if (order.paymentStatus === 'unpaid')
            throw new ResponseError(400, 'Receipt can only be printed for paid orders');

        const product = await order.populate({
            path: 'products.product',
            select: 'name brand'
        });

        await Nodemailer.sendReceipt(product, validateEmail);

        return orderIdResponse(order);
    };
}