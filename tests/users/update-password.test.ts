import {Register} from "../util";
import supertest from "supertest";
import web from "../../src/applications/web";

describe('PATCH /api/users/password', () => {
    let token: string;
    beforeEach(async () => {
        await Register.add();
        token = await Register.login();
    });
    afterEach(async () => {
        await Register.remove();
    });
    it('should can update password', async () => {
        const result = await supertest(web)
            .patch('/api/users/password')
            .set('X-API-TOKEN', token)
            .send({
                oldPassword: 'asdfzxcv123',
                newPassword: 'newpassword123',
                confirmNewPassword: 'newpassword123'
            });
        expect(result.status).toBe(200);
        expect(result.body.success).toBeTruthy();
        expect(result.body.message).toBe('Update password successfully');
    });
    it('should reject if old password is wrong', async () => {
        const result = await supertest(web)
            .patch('/api/users/password')
            .set('X-API-TOKEN', token)
            .send({
                oldPassword: 'wrongpassword',
                newPassword: 'newpassword123',
                confirmNewPassword: 'newpassword123'
            });
        console.log(result.body)
        expect(result.status).toBe(400);
        expect(result.body.success).toBeFalsy();
    });
    it('should reject if new password and confirm password do not match', async () => {
        const result = await supertest(web)
            .patch('/api/users/password')
            .set('X-API-TOKEN', token)
            .send({
                oldPassword: 'asdfzxcv123',
                newPassword: 'newpassword123',
                confirmNewPassword: 'differentpassword'
            });
        expect(result.status).toBe(400);
        expect(result.body.success).toBeFalsy();
    });
    it('should reject if new password same as old password', async () => {
        const result = await supertest(web)
            .patch('/api/users/password')
            .set('X-API-TOKEN', token)
            .send({
                oldPassword: 'asdfzxcv123',
                newPassword: 'asdfzxcv123',
                confirmNewPassword: 'asdfzxcv123'
            });
        expect(result.status).toBe(400);
        expect(result.body.success).toBeFalsy();
    });
    it('should reject if token is invalid', async () => {
        const result = await supertest(web)
            .patch('/api/users/password')
            .set('X-API-TOKEN', 'invalidtoken')
            .send({
                oldPassword: 'asdfzxcv123',
                newPassword: 'newpassword123',
                confirmNewPassword: 'newpassword123'
            });
        expect(result.status).toBe(401);
        expect(result.body.success).toBeFalsy();
        expect(result.body.errors).toBe('Invalid Token')
    });
});
