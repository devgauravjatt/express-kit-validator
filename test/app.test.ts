import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './index';

const validBody = { name: 'Gaurav', age: 22 };

describe('API Validation Tests', () => {
  // =========================
  // BODY TEST (appRoute)
  // =========================
  it('POST /app-route/body → valid', async () => {
    const res = await request(app).post('/app-route/body').send(validBody);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Gaurav');
  });

  it('POST /app-route/body → invalid', async () => {
    const res = await request(app).post('/app-route/body').send({ name: 123, age: 'wrong' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors.body).toBeDefined();
  });

  // =========================
  // QUERY TEST
  // =========================
  it('GET /app-route/query → valid', async () => {
    const res = await request(app).get('/app-route/query?search=test&page=1');

    expect(res.status).toBe(200);
    expect(res.body.data.search).toBe('test');
  });

  it('GET /app-route/query → invalid', async () => {
    const res = await request(app).get('/app-route/query?search=test&page=abc');

    expect(res.status).toBe(400);
    expect(res.body.errors.query).toBeDefined();
  });

  // =========================
  // PARAMS TEST
  // =========================
  it('GET /app-route/params/:id → valid', async () => {
    const res = await request(app).get('/app-route/params/123');

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('123');
  });

  // =========================
  // MIXED TEST
  // =========================
  it('POST /app-route/mix → valid', async () => {
    const res = await request(app).post('/app-route/mix/999?search=test&page=1').send(validBody);

    expect(res.status).toBe(200);
    expect(res.body.body.name).toBe('Gaurav');
  });

  it('POST /app-route/mix → invalid', async () => {
    const res = await request(app).post('/app-route/mix/999?search=test&page=abc').send({ name: 123, age: 'wrong' });

    expect(res.status).toBe(400);
    expect(res.body.errors.body).toBeDefined();
    expect(res.body.errors.query).toBeDefined();
  });

  // =========================
  // validateRequest TEST
  // =========================
  it('POST /validate-request/body → valid', async () => {
    const res = await request(app).post('/validate-request/body').send(validBody);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Gaurav');
  });

  it('POST /validate-request/body → invalid', async () => {
    const res = await request(app).post('/validate-request/body').send({ name: 123 });

    expect(res.status).toBe(400);
    expect(res.body.errors.body).toBeDefined();
  });
});
