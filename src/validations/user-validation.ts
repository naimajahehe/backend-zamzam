import {z, ZodType} from 'zod';
import {userFields} from "./fields";

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        firstName: userFields.firstName,
        lastName: userFields.lastName,
        email: userFields.email,
        username: userFields.username,
        password: userFields.password,
        confirmPassword: userFields.confirmPassword,
        gender: userFields.gender
    }).refine(data => data.password === data.confirmPassword, {
        message: 'Password tidak sama',
        path: ['confirmPassword']
    });

    static readonly LOGIN: ZodType = z.object({
        username: userFields.username,
        password: userFields.password,
    });

    static readonly ID: ZodType = userFields.id;

    static readonly UPDATE: ZodType = z.object({
        firstName: userFields.firstName,
        lastName: userFields.lastName,
        email: userFields.email,
        username: userFields.username,
    });

    static readonly UPDATE_PASSWORD: ZodType = z.object({
        oldPassword: userFields.password,
        newPassword: userFields.password,
        confirmNewPassword: userFields.confirmPassword
    }).refine(field => field.newPassword === field.confirmNewPassword, {
        message: 'Password tidak sama',
        path: ['confirmNewPassword']
    }).refine(field => field.oldPassword !== field.newPassword, {
        message: 'Password yang baru tidak boleh sama dengan password yang lama',
        path: ['newPassword']
    });

    static readonly TOKEN: ZodType = userFields.token;

    static readonly EMAIL: ZodType = userFields.email;

    static readonly VERIFICATION_CODE: ZodType = userFields.verificationCode;

    static readonly RESET_PASSWORD: ZodType = z.object({
        newPassword: userFields.password,
        confirmPassword: userFields.confirmPassword
    }).refine(field => field.newPassword === field.confirmPassword, {
        message: 'Password tidak sama',
        path: ['confirmPassword']
    })
}