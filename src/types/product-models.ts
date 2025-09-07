import {Document, Types} from "mongoose";

export interface CreateProductRequest {
    name: string,
    brand: string,
    price: number,
    stock: number,
    barcode: string,
}

export interface ProductResponse extends CreateProductRequest{
    id: string;
    owner: string;
    sold: number;
    createdAt: string;
    updatedAt: string;
}

export interface IProductDocument extends CreateProductRequest, Document {
    _id: Types.ObjectId;
    owner: Types.ObjectId;
    sold: number;
    createdAt: Date;
    updatedAt: Date;
}

export type GetProductRequestId = string;

export interface UpdateProductRequest {
    name: string;
    brand: string;
    price: number;
    stock: number;
}

export interface ListProductRequest {
    name?: string;
    brand?: string;
    page: number;
    size: number;
}