const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../server');
const ClassModel = require('../models/classModel');
require('dotenv').config({ path: "./.env" });
const { faker } = require('@faker-js/faker');

describe('Class API Test', () => {
    const numTests = 10;

    beforeAll(async () => {
        await ClassModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await ClassModel.deleteMany({});
        const fakeData = [];
        for (let i = 0; i < numTests; i++) {
            fakeData.push({
                name: faker.name.firstName(),
                description: faker.lorem.paragraph(),
                number: faker.random.alphaNumeric(10),
                section: faker.random.alphaNumeric(10),
                semester: faker.random.alphaNumeric(10),
                year: faker.datatype.number({ min: 2000, max: 2023 }),
                instructor: faker.name.firstName(),
            });
        }
        await ClassModel.insertMany(fakeData);
    });

    afterEach(async () => {
        await ClassModel.deleteMany({});
    }
    );

    it('should return all classes', async () => {
        const response = await supertest(app).get('/classes');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(numTests);
        
    }
    );

    it('should return a class', async () => {
        const response = await supertest(app).get('/classes');
        const class1 = response.body[0];
        const response2 = await supertest(app).get(`/classes/${class1._id}`);
        expect(response2.status).toBe(200);
        expect(response2.body).toEqual(class1);
        
    }
    );

    it('should create a class', async () => {
        const class1 = {
            name: faker.name.firstName(),
            description: faker.lorem.paragraph(),
            number: faker.random.alphaNumeric(10),
            section: faker.random.alphaNumeric(10),
            semester: faker.random.alphaNumeric(10),
            year: faker.datatype.number({ min: 2000, max: 2023 }),
            instructor: faker.name.firstName(),
        };
        const response = await supertest(app).post('/classes').send(class1);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(class1.name);
        expect(response.body.description).toBe(class1.description);
        expect(response.body.number).toBe(class1.number);
        expect(response.body.section).toBe(class1.section);
        expect(response.body.semester).toBe(class1.semester);
        expect(response.body.year).toBe(class1.year);
        expect(response.body.instructor).toBe(class1.instructor);        
    }
    );

    it('should update a class', async () => {
        const response = await supertest(app).get('/classes');
        const class1 = response.body[0];
        class1.name = faker.name.firstName();
        const response2 = await supertest(app).patch(`/classes/${class1._id}`).send(class1);
        expect(response2.status).toBe(200);
        expect(response2.body).toEqual(class1);
    } 
    );

    it('should delete a class', async () => {
        const response = await supertest(app).get('/classes');
        const class1 = response.body[0];
        const response2 = await supertest(app).delete(`/classes/${class1._id}`);
        expect(response2.status).toBe(200);
        expect(response2.body).toEqual(class1);
    }
    );

    it('should return 404 for invalid class id', async () => {
        const response = await supertest(app).get('/classes/123456789');
        expect(response.status).toBe(404);
    }
    );

    it('should return 404 for invalid class id on update', async () => {
        const response = await supertest(app).patch('/classes/123456789');
        expect(response.status).toBe(404);
    }
    );

    it('should return 404 for invalid class id on delete', async () => {
        const response = await supertest(app).delete('/classes/123456789');
        expect(response.status).toBe(404);
    }
    );

    it('should return 400 for invalid class on create (missing name)', async () => {
        const class1 = {
            description: faker.lorem.paragraph(),
            number: faker.random.alphaNumeric(10),
            section: faker.random.alphaNumeric(10),
            semester: faker.random.alphaNumeric(10),
            year: faker.datatype.number({ min: 2000, max: 2023 }),
            instructor: faker.name.firstName(),
        };
        const response = await supertest(app).post('/classes').send(class1);
        expect(response.status).toBe(400);
    }
    );

    it('should return 400 for invalid class on create (missing number)', async () => {
        const class1 = {
            name: faker.name.firstName(),
            description: faker.lorem.paragraph(),
            section: faker.random.alphaNumeric(10),
            semester: faker.random.alphaNumeric(10),
            year: faker.datatype.number({ min: 2000, max: 2023 }),
            instructor: faker.name.firstName(),
        };
        const response = await supertest(app).post('/classes').send(class1);
        expect(response.status).toBe(400);
    }
    );

    it('should return 400 for invalid class on create (missing section)', async () => {
        const class1 = {
            name: faker.name.firstName(),
            description: faker.lorem.paragraph(),
            number: faker.random.alphaNumeric(10),
            semester: faker.random.alphaNumeric(10),
            year: faker.datatype.number({ min: 2000, max: 2023 }),
            instructor: faker.name.firstName(),
        };
        const response = await supertest(app).post('/classes').send(class1);
        expect(response.status).toBe(400);
    }
    );

    it('should return 400 for invalid class on create (missing semester)', async () => {
        const class1 = {
            name: faker.name.firstName(),
            description: faker.lorem.paragraph(),
            number: faker.random.alphaNumeric(10),
            section: faker.random.alphaNumeric(10),
            year: faker.datatype.number({ min: 2000, max: 2023 }),
            instructor: faker.name.firstName(),
        };
        const response = await supertest(app).post('/classes').send(class1);
        expect(response.status).toBe(400);
    }
    );

    it('should return 400 for invalid class on create (missing year)', async () => {
        const class1 = {
            name: faker.name.firstName(),
            description: faker.lorem.paragraph(),
            number: faker.random.alphaNumeric(10),
            section: faker.random.alphaNumeric(10),
            semester: faker.random.alphaNumeric(10),
            instructor: faker.name.firstName(),
        };
        const response = await supertest(app).post('/classes').send(class1);
        expect(response.status).toBe(400);
    }
    );

    it('should return 400 for invalid class on update (missing name)', async () => {
        const response = await supertest(app).get('/classes');
        const class1 = response.body[0];
        delete class1.name;
        const response2 = await supertest(app).patch(`/classes/${class1._id}`).send(class1);
        expect(response2.status).toBe(400);
    }
    );

    it('should return 400 for invalid class on update (missing number)', async () => {
        const response = await supertest(app).get('/classes');
        const class1 = response.body[0];
        delete class1.number;
        const response2 = await supertest(app).patch(`/classes/${class1._id}`).send(class1);
        expect(response2.status).toBe(400);
    }
    );

    it('should return 400 for invalid class on update (missing section)', async () => {
        const response = await supertest(app).get('/classes');
        const class1 = response.body[0];
        delete class1.section;
        const response2 = await supertest(app).patch(`/classes/${class1._id}`).send(class1);
        expect(response2.status).toBe(400);
    }
    );

    it('should return 400 for invalid class on update (missing semester)', async () => {
        const response = await supertest(app).get('/classes');
        const class1 = response.body[0];
        delete class1.semester;
        const response2 = await supertest(app).patch(`/classes/${class1._id}`).send(class1);
        expect(response2.status).toBe(400);
    }
    );

    it('should return 400 for invalid class on update (missing year)', async () => {
        const response = await supertest(app).get('/classes');
        const class1 = response.body[0];
        delete class1.year;
        const response2 = await supertest(app).patch(`/classes/${class1._id}`).send(class1);
        expect(response2.status).toBe(400);
    }
    );
});
