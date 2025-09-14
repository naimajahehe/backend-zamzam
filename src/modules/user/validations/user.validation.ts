import {z, ZodType} from 'zod';
import {fields} from "../../../validations/fields";

export class UserValidation {
    static readonly TOKEN: ZodType = fields.token;
    static readonly ID: ZodType = fields.id;

    static readonly UPDATE: ZodType = z.object({
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.email,
        username: fields.username,
    });

    static readonly UPDATE_PASSWORD: ZodType = z.object({
        oldPassword: fields.password,
        newPassword: fields.password,
        confirmNewPassword: fields.confirmPassword
    }).refine(field => field.newPassword === field.confirmNewPassword, {
        message: 'Passwords do not match',
        path: ['confirmNewPassword']
    }).refine(field => field.oldPassword !== field.newPassword, {
        message: 'New password cannot be the same as the old password',
        path: ['newPassword']
    });
}