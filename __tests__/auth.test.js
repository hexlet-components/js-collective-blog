// @flow

import request from 'supertest';

import app from '../src/index';

test('GET /session/new', async () => {
  const res = await request(app)
    .get('/session/new');
  expect(res.status).toBe(200);
});

test('POST /session', async () => {
  const res = await request(app)
    .post('/session')
    .type('form')
    .send({ nickname: 'admin', password: 'qwerty' });
  expect(res.status).toBe(302);
});

test('POST /session (errors)', async () => {
  const res = await request(app)
    .post('/session')
    .type('form')
    .send({ nickname: 'admin', password: 'qwery' });
  expect(res.status).toBe(422);
});

test('DELETE /session', async () => {
  await request(app)
    .post('/session')
    .type('form')
    .send({ nickname: 'admin', password: 'qwerty' });

  const res = await request(app)
    .delete('/session');
  expect(res.status).toBe(302);
});
