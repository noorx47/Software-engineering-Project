const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

let token;
let listId;

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/shoppinglist_test');

  await request(app)
    .post('/api/auth/register')
    .send({
      username: 'listuser',
      email: 'listuser@example.com',
      password: 'password123'
    });

  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'listuser@example.com',
      password: 'password123'
    });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('List Routes', () => {

  test('should create a new list', async () => {
    const res = await request(app)
      .post('/api/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Weekly Shop' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Weekly Shop');
    listId = res.body._id;
  });

  test('should not create list with empty name', async () => {
    const res = await request(app)
      .post('/api/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' });
    expect(res.statusCode).toBe(400);
  });

  test('should get all lists', async () => {
    const res = await request(app)
      .get('/api/lists')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('should not access lists without token', async () => {
    const res = await request(app)
      .get('/api/lists');
    expect(res.statusCode).toBe(401);
  });

});

describe('Item Routes', () => {

  test('should add an item to a list', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Milk',
        quantity: '2 litres',
        category: 'Food',
        listId: listId
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Milk');
  });

  test('should not add item with empty name', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '',
        quantity: '1',
        category: 'Food',
        listId: listId
      });
    expect(res.statusCode).toBe(400);
  });

  test('should get all items in a list', async () => {
    const res = await request(app)
      .get(`/api/items/${listId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
