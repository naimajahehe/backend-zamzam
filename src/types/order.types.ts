import {Types} from "mongoose";

export interface OrderTypes {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    products: Array<OrderProducts>;
    paymentMethod: "cash" | "transfer" | "e-wallet";
    paymentStatus: "paid" | "unpaid";
    paymentDate: Date | null;
    orderStatus: "pending" | "completed" | "canceled";
    isCompleted: boolean;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderProducts {
    product: Types.ObjectId | ProductModel;
    quantity: number;
    price: number;
}

export interface ProductModel {
    _id: Types.ObjectId;
    name: string;
    brand: string;
    price: number;
    barcode: string;
    stock: number;
}

export interface OrderLinksModels {
    cancelOrder?: string;
    updateOrder?: string;
    deleteOrder?: string;
    getOrder?: string;
}

export interface OrderProductResponse {
    product: ProductModel;
    quantity: number;
    price: number;
}

export type OrderResponse = Omit<OrderTypes, 'createdAt' | 'updatedAt'> & {
    products: Array<OrderProductResponse>;
    links?: OrderLinksModels;
}

export type UpdateOrderRequest = Pick<OrderTypes, 'paymentMethod' | 'paymentStatus' > & {
    products: Array<OrderProducts>
};

export type ListOrderRequest = {
    search?: string;
    page: number;
    size: number;
}

export type ListOrderResponse = Pick<OrderTypes, '_id' | 'user' | 'totalPrice' | 'paymentStatus' | 'orderStatus' | 'products'> & {
    links: OrderLinksModels;
}

export type OrderIdResponse = {
    orderId: string | Types.ObjectId;
}

export type OrderId = string;
export type ScanBarcode = string;


