const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../server');
const SchoolModel = require('../models/schoolModel');
require('dotenv').config({ path: "./.env" });
const { faker } = require('@faker-js/faker');

describe('School API Test', () => {
    const numTests = 10;

    beforeAll(async () => {
        await SchoolModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await SchoolModel.deleteMany({});
        const fakeData = [];
        for (let i = 0; i < numTests; i++) {
            fakeData.push({
                name: faker.name.firstName(),
                address: faker.address.streetAddress(),
            });
        }
        await SchoolModel.insertMany(fakeData);
    });

    afterEach(async () => {
        await SchoolModel.deleteMany({});
    }
    );

    it('should return all schools', async () => {
        const response = await supertest(app).get('/schools');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(numTests);
        
    }
    );

    it('should return a school', async () => {
        const response = await supertest(app).get('/schools');
        const school = response.body[0];
        const response2 = await supertest(app).get(`/schools/${school._id}`);
        expect(response2.status).toBe(200);
        expect(response2.body).toEqual(school);
        
    }
    );

    it('should create a school', async () => {
        const school = {
            name: faker.name.firstName(),
            address: faker.address.streetAddress(),
        };
        const response = await supertest(app).post('/schools').send(school);
        expect(response.status).toBe(201);
        expect(response.body.name).toEqual(school.name);
        expect(response.body.address).toEqual(school.address);
        
    }
    );

    it('should update a school', async () => {
        const response = await supertest(app).get('/schools');
        const school = response.body[0];
        const newSchool = {
            name: faker.name.firstName(),
            address: faker.address.streetAddress(),
        };
        const response2 = await supertest(app).patch(`/schools/${school._id}`).send(newSchool);
        expect(response2.status).toBe(200);
        expect(response2.body.name).toEqual(newSchool.name);
        expect(response2.body.address).toEqual(newSchool.address);
        
    }
    );

    it('should delete a school', async () => {
        const response = await supertest(app).get('/schools');
        const school = response.body[0];
        const response2 = await supertest(app).delete(`/schools/${school._id}`);
        expect(response2.status).toBe(200);
        expect(response2.body).toEqual(school);
        
    }
    );

    it('should return 404 for invalid school id', async () => {
        const response = await supertest(app).get('/schools/123');
        expect(response.status).toBe(404);
        
    }
    );

    it('should return 404 for invalid school id on update', async () => {
        const response = await supertest(app).patch('/schools/123');
        expect(response.status).toBe(404);
        
    }
    );

    it('should return 404 for invalid school id on delete', async () => {
        const response = await supertest(app).delete('/schools/123');
        expect(response.status).toBe(404);
        
    }
    );

    it('should return 400 for invalid school data on create (missing name)', async () => {
        const school = {
            address: faker.address.streetAddress(),
        };
        const response = await supertest(app).post('/schools').send(school);
        expect(response.status).toBe(400);
        
    }
    );

    it('should return 400 for invalid school data on update (missing name)', async () => {
        const response = await supertest(app).get('/schools');
        const school = response.body[0];
        const newSchool = {
            address: faker.address.streetAddress(),
        };
        const response2 = await supertest(app).patch(`/schools/${school._id}`).send(newSchool);
        expect(response2.status).toBe(400);
        
    }
    );
}
);


