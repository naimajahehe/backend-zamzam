import mongoose from "../../../../mongoose/config";
import type {OrderTypes} from "../../../types/order.types";

const orderSchema = new mongoose.Schema<OrderTypes>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products:[{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    paymentMethod: {
        type: String,
        enum: ['cash', 'transfer', 'e-wallet'],
        required: true,
        default: 'cash'
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid'
    },
    paymentDate: {
        type: Date,
        default: null
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false
    },
    totalPrice:{
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema);

export default Order;