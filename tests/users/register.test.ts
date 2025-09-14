import supertest from 'supertest';
import web from "../../src/applications/web";
import {Register} from "../util";
import User from "../../src/modules/user/models/user";
import logger from "../../src/applications/logging";

describe('POST /api/users', () => {
    afterEach(async () => {
        await Register.remove();
    })
    it('should can register', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                firstName: 'Muhammad',
                lastName: 'Naim',
                email: 'naimmnaim123@gmail.com',
                username: 'naimmnai12',
                password: 'asdfzxcv123',
                confirmPassword: 'asdfzxcv123',
                gender: 'female',
            })
        console.log(result.body);
        expect(result.status).toBe(201);
        expect(result.body.errors).toBeNull();
        expect(result.body.success).toBeTruthy();
    });

    it('should reject if field is empty', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                firstName: '',
                lastName: '',
                email: 'naimmnaim123@gmail.com',
                username: 'naimmnai12',
                password: '',
                confirmPassword: '',
                gender: '',
            })
        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.success).toBeFalsy();
        expect(result.body.errors).toBeDefined();
        expect(result.body.errors).toContain('firstName: minimal 3 karakter');
        expect(result.body.errors).toContain('lastName: minimal 3 karakter');
        expect(result.body.errors).toContain('password: minimal 6 karakter');
        expect(result.body.errors).toContain('confirmPassword: minimal 6 karakter');
    });

    it('should reject if there is same username', async () => {
        await User.insertOne({
            firstName: 'Muhammad',
            lastName: 'Naim',
            username: 'naimmnaim123',
            email: 'naimmnaim123@gmail.com',
            password: 'asdfzxcv123',
            confirmPassword: 'asdfzxcv123',
            gender: 'male',
        })
        const result = await supertest(web)
            .post('/api/users')
            .send({
                firstName: 'Muhammad',
                lastName: 'Naim',
                username: 'naimmnaim123',
                email: 'naimmnaim123@gmail.com',
                password: 'asdfzxcv123',
                confirmPassword: 'asdfzxcv123',
                gender: 'male',
            })
        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.success).toBeFalsy();
        expect(result.body.errors).not.toBeNull();
        expect(result.body.errors).toContain('Username or email already exists');
    });
});