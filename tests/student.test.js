const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../server');
const StudentModel = require('../models/studentModel');
require('dotenv').config({ path: "./.env" });
const { faker } = require('@faker-js/faker');

describe('Student API Test', () => {
    const numTests = 10;

    beforeAll(async () => {
        await StudentModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await StudentModel.deleteMany({});
        const fakeData = [];
        for (let i = 0; i < numTests; i++) {
            fakeData.push({
                name: faker.name.firstName(),
                email: faker.internet.email(),
                phone: faker.phone.number(),
                classes: [faker.random.alphaNumeric(10), faker.random.alphaNumeric(10)],
            });
        }
        await StudentModel.insertMany(fakeData);
    });

    afterEach(async () => {
        await StudentModel.deleteMany({});
    }
    );

    it('should return all students', async () => {
        const response = await supertest(app).get('/students');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(numTests);
        
    }
    );

    it('should return a student', async () => {
        const response = await supertest(app).get('/students');
        const student = response.body[0];
        const response2 = await supertest(app).get(`/students/${student._id}`);
        expect(response2.status).toBe(200);
        expect(response2.body).toEqual(student);
        
    }
    );

    it('should create a student', async () => {
        const student = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            classes: [faker.random.alphaNumeric(10), faker.random.alphaNumeric(10), faker.random.alphaNumeric(10)],
        };
        const response = await supertest(app).post('/students').send(student);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(student.name);
        expect(response.body.email).toBe(student.email);
        expect(response.body.phone).toBe(student.phone);
        expect(response.body.classes).toEqual(student.classes);
        
    }
    );

    it('should update a student', async () => {
        const response = await supertest(app).get('/students');
        const student = response.body[0];
        const response2 = await supertest(app).patch(`/students/${student._id}`).send({ name: 'new name' });
        expect(response2.status).toBe(200);
        expect(response2.body.name).toBe('new name');
        
    }
    );

    it('should delete a student', async () => {
        const response = await supertest(app).get('/students');
        const student = response.body[0];
        const response2 = await supertest(app).delete(`/students/${student._id}`);
        expect(response2.status).toBe(200);
        expect(response2.body.name).toBe(student.name);
        expect(response2.body.email).toBe(student.email);
        expect(response2.body.phone).toBe(student.phone);
        expect(response2.body.classes).toEqual(student.classes);
        
    }
    );

    it('should return 404 for invalid student id', async () => {
        const response = await supertest(app).get('/students/123');
        expect(response.status).toBe(404);
        
    }
    );

    it('should return 404 for invalid student id on update', async () => {
        const response = await supertest(app).patch('/students/123').send({ name: 'new name' });
        expect(response.status).toBe(404);
        
    }
    );

    it('should return 404 for invalid student id on delete', async () => {
        const response = await supertest(app).delete('/students/123');
        expect(response.status).toBe(404);
        
    }
    );

    it('should return 400 for invalid student data on create (missing name)', async () => {
        const student = {
            email: faker.internet.email(),
            phone: faker.phone.number(),
            classes: [faker.random.alphaNumeric(10), faker.random.alphaNumeric(10), faker.random.alphaNumeric(10)],
        };
        const response = await supertest(app).post('/students').send(student);
        expect(response.status).toBe(400);
        
    }
    );

    it('should return 400 for invalid student data on create (missing email)', async () => {
        const student = {
            name: faker.name.firstName(),
            phone: faker.phone.number(),
            classes: [faker.random.alphaNumeric(10), faker.random.alphaNumeric(10), faker.random.alphaNumeric(10)],
        };
        const response = await supertest(app).post('/students').send(student);
        expect(response.status).toBe(400);
        
    }
    );
}
);

