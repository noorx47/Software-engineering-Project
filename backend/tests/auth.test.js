const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shoppinglist_test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Auth Routes', () => {

  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  test('should not register with same email twice', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser2',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(400);
  });

  test('should not register with invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser3',
        email: 'notanemail',
        password: 'password123'
      });
    expect(res.statusCode).toBe(400);
  });

  test('should not register with short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser4',
        email: 'test4@example.com',
        password: '123'
      });
    expect(res.statusCode).toBe(400);
  });

  test('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toBe(400);
  });

  test('should not login with empty fields', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: '',
        password: ''
      });
    expect(res.statusCode).toBe(400);
  });

});