import type {OrderModels, OrderResponse} from "../types/order-models";

export const orderResponse = (order: OrderModels): OrderResponse => {
    return {
        _id: order._id,
        user: order.user,
        products: {
            product: {
                _id: order.products.product._id,
                name: order.products.product.name,
                brand: order.products.product.brand,
                price: order.products.product.price,
                barcode: order.products.product.barcode,
                stock: order.products.product.stock
            },
            quantity: order.products.quantity,
            price: order.products.price,
        },
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        paymentDate: order.paymentDate,
        orderStatus: order.orderStatus,
        isCompleted: order.isCompleted,
        totalPrice: order.totalPrice,
    }
}