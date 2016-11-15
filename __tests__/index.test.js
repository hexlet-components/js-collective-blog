// @flow

import request from 'supertest';

import app from '../src/index';

test('GET /', async () => {
  const res = await request(app)
    .get('/');
  expect(res.status).toBe(200);
});

test('GET /posts/:id', async () => {
  const res = await request(app)
    .get('/posts/1');
  expect(res.status).toBe(200);
});
