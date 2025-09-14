import {z, ZodType} from "zod";
import {fields} from "../../../validations/fields";

export class AuthValidation {
    static readonly REGISTER: ZodType = z.object({
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.email,
        username: fields.username,
        password: fields.password,
        confirmPassword: fields.confirmPassword,
        gender: fields.gender
    }).refine(data => data.password === data.confirmPassword, {
        message: 'Password do not match',
        path: ['confirmPassword']
    });

    static readonly LOGIN: ZodType = z.object({
        username: fields.username,
        password: fields.password,
    });

    static readonly RESET_PASSWORD: ZodType = z.object({
        password: fields.password,
        confirmPassword: fields.confirmPassword
    }).refine(field => field.password === field.confirmPassword, {
        message: 'Password do not match',
        path: ['confirmPassword']
    });

    static readonly TOKEN: ZodType = fields.token;
    static readonly ID: ZodType = fields.id;
    static readonly EMAIL: ZodType = fields.email;
    static readonly VERIFICATION_CODE: ZodType = fields.verificationCode;
}