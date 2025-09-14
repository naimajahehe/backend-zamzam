import {Register} from "../util";
import supertest from "supertest";
import web from "../../src/applications/web";
import logger from "../../src/applications/logging";

describe('PATCH /api/users/update', () => {
    let token: string
    beforeEach(async () => {
        await Register.add();
        token = await Register.login();
    })
    afterEach(async () => {
        await Register.remove();
    })
    it('should can update user', async () => {
        const result = await supertest(web)
            .patch('/api/users/update')
            .set('X-API-TOKEN', token)
            .send({
                firstName: 'Muhammad',
                lastName: 'Naim',
                email: 'asdsad@gmail.com',
                username: 'naimmnaim123'
            })
        console.log(result.body);
        expect(result.status).toBe(200);
        expect(result.body.success).toBeTruthy();
        expect(result.body.errors).toBeNull();
    });

    it('should reject if empty field', async () => {
        const result = await supertest(web)
            .patch('/api/users/update')
            .set('X-API-TOKEN', token)
            .send({
                firstName: '',
                lastName: '',
                email: '',
                username: ''
            })
        expect(result.status).toBe(400);
        expect(result.body.success).toBeFalsy();
        expect(result.body.errors).not.toBeNull();
    });

    it('should reject if invalid token', async () => {
        const result = await supertest(web)
            .patch('/api/users/update')
            .set('X-API-TOKEN', 'naimmna123')
            .send({
                firstName: 'Muhammad',
                lastName: 'Naim',
                email: 'naimblog123@gmail.com',
                username: 'naimaja123'
            })
        expect(result.status).toBe(401);
        expect(result.body.success).toBeFalsy();
        expect(result.body.errors).not.toBeNull();
        expect(result.body.errors).toBe('Invalid Token');
    });

    it('should reject if empty token', async () => {
        const result = await supertest(web)
            .patch('/api/users/update')
            .send({
                firstName: 'Muhammad',
                lastName: 'Naim',
                email: 'naimblog123@gmail.com',
                username: 'naimaja123'
            })
        expect(result.status).toBe(401);
        expect(result.body.success).toBeFalsy();
        expect(result.body.errors).not.toBeNull();
        expect(result.body.errors).toBe('Unauthorized');
    });
});