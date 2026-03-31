import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './index';

const validBody = { name: 'Gaurav', age: 22, address: { city: 'New York', street: 'Main St' } };
const invalidBody = { name: 123, age: 'wrong' };
const invalidBodyWithAddress = { name: 123, age: 'wrong', address: { city: 'New York' } };

describe('API Validation Tests', () => {
  describe('/app-route', () => {
    describe('POST /body', () => {
      it('should return 200 for a valid body', async () => {
        const res = await request(app).post('/app-route/body').send(validBody);
        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('Gaurav');
      });

      it('should return 400 for an invalid body', async () => {
        const res = await request(app).post('/app-route/body').send(invalidBody);
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Validation failed');
        expect(res.body.errors.body.name).toBe('Name is required');
        expect(res.body.errors.body.age).toBe('Age is required');
        expect(res.body.errors.body.address).toBe('Address is required');
      });

      it('should return 400 for an invalid body with address', async () => {
        const res = await request(app).post('/app-route/body').send(invalidBodyWithAddress);
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Validation failed');
        expect(res.body.errors.body.address.street).toBe('Street is required');
      });
    });

    describe('GET /query', () => {
      it('should return 200 for valid query parameters', async () => {
        const res = await request(app).get('/app-route/query?search=test&page=1');
        expect(res.status).toBe(200);
        expect(res.body.data.search).toBe('test');
      });

      it('should return 400 for invalid query parameters', async () => {
        const res = await request(app).get('/app-route/query?search=test&page=abc');
        expect(res.status).toBe(400);
        expect(res.body.errors.query).toBeDefined();
      });
    });

    describe('GET /params/:id', () => {
      it('should return 200 for a valid ID', async () => {
        const res = await request(app).get('/app-route/params/123');
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe('123');
      });
    });

    describe('POST /mix/:id', () => {
      it('should return 200 for a valid mix of parameters, query, and body', async () => {
        const res = await request(app).post('/app-route/mix/999?search=test&page=1').send(validBody);
        expect(res.status).toBe(200);
        expect(res.body.body.name).toBe('Gaurav');
      });

      it('should return 400 for an invalid mix', async () => {
        const res = await request(app).post('/app-route/mix/999?search=test&page=abc').send(invalidBody);
        expect(res.status).toBe(400);
        expect(res.body.errors.body).toBeDefined();
        expect(res.body.errors.query).toBeDefined();
      });
    });
  });

  describe('/validate-request', () => {
    describe('POST /body', () => {
      it('should return 200 for a valid body', async () => {
        const res = await request(app).post('/app-route/body').send(validBody);
        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe('Gaurav');
      });

      it('should return 400 for an invalid body', async () => {
        const res = await request(app).post('/app-route/body').send(invalidBody);
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Validation failed');
        expect(res.body.errors.body.name).toBe('Name is required');
        expect(res.body.errors.body.age).toBe('Age is required');
        expect(res.body.errors.body.address).toBe('Address is required');
      });

      it('should return 400 for an invalid body with address', async () => {
        const res = await request(app).post('/app-route/body').send(invalidBodyWithAddress);
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Validation failed');
        expect(res.body.errors.body.address.street).toBe('Street is required');
      });
    });

    describe('GET /query', () => {
      it('should return 200 for valid query parameters', async () => {
        const res = await request(app).get('/validate-request/query?search=test&page=1');
        expect(res.status).toBe(200);
        expect(res.body.data.search).toBe('test');
      });

      it('should return 400 for invalid query parameters', async () => {
        const res = await request(app).get('/validate-request/query?search=test&page=abc');
        expect(res.status).toBe(400);
        expect(res.body.errors.query).toBeDefined();
      });
    });

    describe('GET /params/:id', () => {
      it('should return 200 for a valid ID', async () => {
        const res = await request(app).get('/validate-request/params/123');
        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe('123');
      });
    });

    describe('POST /mix/:id', () => {
      it('should return 200 for a valid mix of parameters, query, and body', async () => {
        const res = await request(app).post('/validate-request/mix/999?search=test&page=1').send(validBody);
        expect(res.status).toBe(200);
        expect(res.body.body.name).toBe('Gaurav');
      });

      it('should return 400 for an invalid mix', async () => {
        const res = await request(app).post('/validate-request/mix/999?search=test&page=abc').send(invalidBody);
        expect(res.status).toBe(400);
        expect(res.body.errors.body).toBeDefined();
        expect(res.body.errors.query).toBeDefined();
      });
    });
  });
});
