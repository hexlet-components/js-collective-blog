// @flow

import request from 'supertest';

import app from '../src/index';

test('GET /', async () => {
  const res = await request(app)
    .get('/');
  expect(res.status).toBe(200);
});
