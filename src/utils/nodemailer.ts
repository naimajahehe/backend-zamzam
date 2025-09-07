import nodemailer from 'nodemailer';
import 'dotenv/config';
import { customAlphabet } from 'nanoid';
import {ResponseError} from "../errors/response-error";
import type {AuthToken, UserEmail} from "../types/user-models";

const USER = process.env.SMTP_USER as string;
const HOST = process.env.SMTP_HOST as string;
const PASSWORD = process.env.SMTP_PASSWORD as string;
const PORT = process.env.SMTP_PORT as string;
const APP_URL = process.env.APP_URL as string;

export class Nodemailer {
    private static transport = nodemailer.createTransport({
        host: HOST,
        port: Number(PORT),
        secure: false,
        auth: {
            user: USER,
            pass: PASSWORD
        }
    });

    static sendVerifyEmail = async (token: AuthToken, email: UserEmail) => {
        const verifyUrl = `${APP_URL}/api/users/verify-email?token=${token}`;
        const info = await this.transport.sendMail({
            from: `"Support" <${USER}>`,
            to: email,
            subject: 'email verification',
            text: `Verify your email here`,
            html: `<a href="${verifyUrl}">Click here</a><p>to verify</p>`
        });
        return info.accepted
    };

    static sendVerificationCode = async (email: UserEmail): Promise<number> => {
        const code = customAlphabet('123456789', 6)();
        const info = await this.transport.sendMail({
            from: `"Support" <${USER}>`,
            to: email,
            subject: 'verification code',
            text: `Your verification code is: ${code}`,
            html: `<p>Your verification code is: <h1>${code}</h1></p>`
        })
        if (!info.accepted || info.accepted.length === 0) throw new ResponseError(400, 'Failed to send verification code');
        return Number(code);
    }
}