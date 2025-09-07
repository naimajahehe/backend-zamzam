import { Types } from "mongoose";

export interface OrderModels {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    products: OrderProducts;
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
    product: ProductModel;
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

export type ScanBarcode = string;

export type OrderResponse = Omit<OrderModels, 'createdAt' | 'updatedAt'>

export type UpdateOrderRequest = Pick<OrderModels, 'paymentMethod' | 'paymentStatus' > & {
    quantity: number;
};

export type OrderId = string;


