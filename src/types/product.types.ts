import type {Types} from "mongoose";

export interface ProductTypes {
    _id: Types.ObjectId;
    name: string;
    brand: string;
    price: number;
    stock: number;
    barcode: string;
    owner: Types.ObjectId;
    sold: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductLinksModels {
    updateProduct?: string;
    deleteProduct?: string;
    getProduct?: string;
}

export type CreateProductRequest = Pick<ProductTypes,
    'name' | 'brand' | 'price' | 'stock' | 'barcode'>;

export type UpdateProductRequest = Pick<ProductTypes,
    'name' | 'brand' | 'price' | 'stock'>;

export type ListProductRequest = Partial<Pick<ProductTypes, 'name' | 'brand'>> & {
    search?: string;
    page: number;
    size: number;
}

export type ProductResponse = Pick<ProductTypes,
    '_id' | 'name' | 'brand' | 'price' | 'stock' | 'barcode' | 'updatedAt'> & {
    links?: ProductLinksModels;
}
