const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../server');
const TutorModel = require('../models/tutorModel');
require('dotenv').config({ path: "./.env" });
const { faker } = require('@faker-js/faker');

describe('Tutor API Test', () => {
    const numTests = 10;

    beforeAll(async () => {
        await TutorModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await TutorModel.deleteMany({});
        const fakeData = [];
        for (let i = 0; i < numTests; i++) {
            fakeData.push({
                name: faker.name.firstName(),
                email: faker.internet.email(),
                phone: faker.phone.number(),
                classes: [faker.random.alphaNumeric(10), faker.random.alphaNumeric(10)],
                rating: faker.datatype.number({ min: 0, max: 5 }),
            });
        }
        await TutorModel.insertMany(fakeData);
    });

    afterEach(async () => {
        await TutorModel.deleteMany({});
    }
    );

    it('should return all tutors', async () => {
        const response = await supertest(app).get('/tutors');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(numTests);
        
    }
    );

    it('should return a tutor', async () => {
        const response = await supertest(app).get('/tutors');
        const tutor = response.body[0];
        const response2 = await supertest(app).get(`/tutors/${tutor._id}`);
        expect(response2.status).toBe(200);
        expect(response2.body).toEqual(tutor);
        
    }
    );

    it('should create a tutor', async () => {
        const tutor = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            classes: [faker.random.alphaNumeric(10), faker.random.alphaNumeric(10), faker.random.alphaNumeric(10)],
            rating: faker.datatype.number({ min: 0, max: 5 }),
        };
        const response = await supertest(app).post('/tutors').send(tutor);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(tutor.name);
        expect(response.body.email).toBe(tutor.email);
        expect(response.body.phone).toBe(tutor.phone);
        expect(response.body.classes).toEqual(tutor.classes);
        expect(response.body.rating).toBe(tutor.rating);
        
    }
    );

    it('should update a tutor', async () => {
        const response = await supertest(app).get('/tutors');
        const tutor = response.body[0];
        const response2 = await supertest(app).patch(`/tutors/${tutor._id}`).send({ name: 'New Name' });
        expect(response2.status).toBe(200);
        expect(response2.body.name).toBe('New Name');
        
    }   
    );

    it('should delete a tutor', async () => {
        const response = await supertest(app).get('/tutors');
        const tutor = response.body[0];
        const response2 = await supertest(app).delete(`/tutors/${tutor._id}`);
        expect(response2.status).toBe(200);
        expect(response2.body.name).toBe(tutor.name);
        expect(response2.body.email).toBe(tutor.email);
        expect(response2.body.phone).toBe(tutor.phone);
        expect(response2.body.classes).toEqual(tutor.classes);
        expect(response2.body.rating).toBe(tutor.rating);
        
    }
    );

    it('should return 404 for invalid tutor id', async () => {
        const response = await supertest(app).get('/tutors/123');
        expect(response.status).toBe(404);
        
    }
    );

    it('should return 404 for invalid tutor id on update', async () => {
        const response = await supertest(app).patch('/tutors/123').send({ name: 'New Name' });
        expect(response.status).toBe(404);
        
    }
    );

    it('should return 404 for invalid tutor id on delete', async () => {
        const response = await supertest(app).delete('/tutors/123');
        expect(response.status).toBe(404);
        
    }
    );

    it('should return 400 for invalid tutor data on create (missing name)', async () => {
        const tutor = {
            email: faker.internet.email(),
            phone: faker.phone.number(),
            classes: [faker.random.alphaNumeric(10), faker.random.alphaNumeric(10), faker.random.alphaNumeric(10)],
        };
        const response = await supertest(app).post('/tutors').send(tutor);
        expect(response.status).toBe(400);
        
    }
    );

    it('should return 400 for invalid tutor data on create (missing email)', async () => {
        const tutor = {
            name: faker.name.firstName(),
            phone: faker.phone.number(),
            classes: [faker.random.alphaNumeric(10), faker.random.alphaNumeric(10), faker.random.alphaNumeric(10)],
        };
        const response = await supertest(app).post('/tutors').send(tutor);
        expect(response.status).toBe(400);
        
    }
    );
}
);



