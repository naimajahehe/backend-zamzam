import type {
    ListOrderResponse,
    OrderIdResponse,
    OrderTypes,
    OrderResponse,
    ProductModel
} from "../../../types/order.types";
import type {Pageable} from "../../../types/page";

export const getOrderResponse = (order: OrderTypes): OrderResponse => {
    return {
        _id: order._id,
        user: order.user,
        products: order.products.map(item => ({
            product: {
                _id: (item.product as ProductModel)._id,
                name: (item.product as ProductModel).name,
                brand: (item.product as ProductModel).brand,
                barcode: (item.product as ProductModel).barcode,
                price: (item.product as ProductModel).price,
                stock: (item.product as ProductModel).stock
            },
            quantity: item.quantity,
            price: item.price
        })),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        paymentDate: order.paymentDate,
        orderStatus: order.orderStatus,
        isCompleted: order.isCompleted,
        totalPrice: order.totalPrice,
        links: {
            cancelOrder: `/api/orders/${order._id}/cancel`,
            updateOrder: `/api/orders/${order._id}/update`,
        }
    }
}

export const orderIdResponse= (order: OrderTypes): OrderIdResponse => {
    return {
        orderId: order._id
    }
}

export const listOrderResponse = (order: Array<OrderTypes>, total: number, size: number, page: number): Pageable<ListOrderResponse> => {
    return {
        data: order.map(item => ({
            _id: item._id,
            user: item.user,
            products: item.products,
            paymentStatus: item.paymentStatus,
            orderStatus: item.orderStatus,
            totalPrice: item.totalPrice,
            links: {
                updateOrder: `/api/orders/${item._id}/update`,
                getOrder: `/api/orders/${item._id}`,
                deleteOrder: `/api/orders/${item._id}/delete`
            }
        })),
        paging: {
            size: size,
            total_page: Math.ceil(total / size),
            current_page: page
        }
    }
}