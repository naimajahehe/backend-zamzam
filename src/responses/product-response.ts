import type { IProductDocument, ProductResponse } from "../types/product-models";

export const productResponse = (product: IProductDocument): ProductResponse => ({
    id: product._id.toString(),
    name: product.name,
    brand: product.brand,
    price: product.price,
    stock: product.stock,
    barcode: product.barcode,
    owner: product.owner.toString(),
    sold: product.sold ?? 0,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
});
