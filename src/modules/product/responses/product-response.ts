import type { ProductTypes, ProductResponse } from "../../../types/product.types";
import type {Pageable} from "../../../types/common.types";

export const productResponse = (product: ProductTypes): ProductResponse => ({
    _id: product._id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    stock: product.stock,
    barcode: product.barcode,
    updatedAt: product.updatedAt,
    links: {
        getProduct: `/api/products/${product._id}`,
        updateProduct: `/api/products/${product._id}/update`,
        deleteProduct: `/api/products/${product._id}/delete`
    }
});

export const listProductResponse = (product: Array<ProductTypes>, size: number, total: number, current: number): Pageable<ProductResponse> => {
    return {
        data: product.map(item => productResponse(item)),
        paging: {
            size: size,
            total_page: Math.ceil(total / size),
            current_page: current
        }
    }
}
