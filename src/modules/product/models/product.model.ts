import mongoose from "../../../../mongoose/config";
import type {ProductTypes} from "../../../types/product.types";

const productSchema = new mongoose.Schema<ProductTypes>({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    barcode: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sold: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

productSchema.index({ name: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ name: 'text', brand: 'text' });

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;