import User from "../src/models/user";
import bcrypt from "bcrypt";
import Product from "../src/models/product";
import {Types} from "mongoose";
import {v4 as uuid} from "uuid";
import randomName from "@scaleway/random-name";
import supertest from "supertest";
import web from "../src/applications/web";

export class Register {
    static async add(): Promise<void> {
        await User.create({
            firstName: "Muhammad",
            lastName: "Naim",
            username: "naimmnaim123",
            email: "naimmnaim123@gmail.com",
            password: await bcrypt.hash("asdfzxcv123", 10),
            gender: "male"
        });
    }

    static async remove(): Promise<void> {
        await User.deleteMany({
            $or: [
                { username: "naimmnaim123" },
                { email: "naimmnaim123@gmail.com" }
            ]
        });
    }

    static async login(): Promise<string> {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'naimmnaim123',
                password: 'asdfzxcv123'
            });
        return result.body.data.token
    }

    static async get() {
        return User.findOne({username: 'naimmnaim123'});
    }
}

export class Item {
    static async add(): Promise<void> {
        await Product.create({
            name: "Skincare Makjos",
            brand: "Wardah",
            price: 20000,
            stock: 2,
            barcode: 12341234,
            owner: new Types.ObjectId("68b56f4cd4a8f8f4782659b1")
        });
    }

    static async get() {
        return Product.findOne({barcode: 12341234})
    }

    static async remove(): Promise<void> {
        await Product.deleteMany({ $or: [{ barcode: 12341234 }, { brand: "Wardah" }] });
    }

    static async addMany(): Promise<void> {
        const data = [];
        for (let i = 0; i < 50; i++) {
            data.push({
                name: randomName(),
                brand: "Wardah",
                price: 20000,
                stock: 1,
                barcode: uuid(),
                owner: new Types.ObjectId("68b56f4cd4a8f8f4782659b1")
            });
        }
        await Product.insertMany(data);
    }
}
