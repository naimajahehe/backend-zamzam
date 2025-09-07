import {z} from "zod";
import {Types} from "mongoose";

export const userFields = {
    id: z.union([
        z.string().regex(/^[0-9a-fA-F]{24}$/, "id harus berupa ObjectId MongoDB"),
        z.instanceof(Types.ObjectId)
    ]).transform((val) =>
        typeof val === "string" ? new Types.ObjectId(val) : val
    ),
    firstName: z.string().min(3, 'minimal 3 karakter').max(100, 'maksimal 100 karakter'),
    lastName: z.string().min(3, 'minimal 3 karakter').max(100, 'maksimal 100 karakter'),
    email: z.email().min(3, 'minimal 3 karakter').max(100, 'maksimal 100 karakter'),
    username: z.string().min(5, 'minimal 5 karakter').max(100, 'maksimal 100 karakter'),
    password: z.string().min(6, 'minimal 6 karakter').max(100, 'maksimal 100 karakter'),
    confirmPassword: z.string().min(6, 'minimal 6 karakter').max(100, 'maksimal 100 karakter'),
    gender: z.enum(['male', 'female'], 'gender male atau female saja'),
    token: z.string().min(1, 'Wajib mengisi token'),
    verificationCode: z.number().int().min(100000, "Verifikasi kode minimal 6 digit").max(999999, "Verifikasi kode maksimal 6 digit")
}

export const productFields = {
    id: z.string().min(1, 'id wajib diisi'),
    name: z.string().min(3, 'minimal 3 karakter').max(100, 'maksimal 100 karakter'),
    brand: z.string().min(3, 'minimal 3 karakter').max(100, 'maksimal 100 karakter'),
    price: z.number().min(1000, 'minimal 1000').positive('harga harus positif'),
    stock: z.number().int('stok harus bilangan bulat').nonnegative('stok tidak boleh negatif'),
    barcode: z.string().min(8, 'kode barcode minimal 8 karakter').max(50, 'kode barcode maksimal 50 karakter'),
    sold: z.number().min(0).positive('stok tidak boleh negatif').int('stok harus bilangan bulat'),
    optionalName: z.string().min(1, 'minimal 1 karakter').max(100, 'maksimal 100 karakter').optional(),
    optionalBrand: z.string().min(1, 'minimal 3 karakter').max(100, 'maksimal 100 karakter').optional(),
    page: z.number().min(1, 'minimal 1 karakter').positive('angka harus bilangan positif'),
    size: z.number().min(1, 'minimal 1 karakter').max(100,'maksimal 100 karakter').positive('angka harus bilangan positif')
}

export const orderFields = {
    paymentMethod: z.enum(['cash', 'transfer', 'e-wallet']),
    paymentStatus: z.enum(['paid', 'unpaid']),
    quantity: z.number().min(1).max(100)
}