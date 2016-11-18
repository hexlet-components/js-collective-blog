// @flow

import matchers from 'jest-supertest-matchers';
import request from 'supertest';

import app from '../src/index';

describe('requests', () => {
  beforeAll(() => {
    jasmine.addMatchers(matchers);
  });

  it('GET /', async () => {
    const res = await request(app)
      .get('/');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET /posts/:id', async () => {
    const res = await request(app)
      .get('/posts/1');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET /undefined', async () => {
    const res = await request(app)
      .get('/undefined');
    expect(res).toHaveHTTPStatus(404);
  });

  it('GET /users/new', async () => {
    const res = await request(app)
      .get('/users/new');
    expect(res).toHaveHTTPStatus(200);
  });

  it('POST /users', async () => {
    const res = await request(app)
      .post('/users')
      .type('form')
      .send({ nickname: 'nickname', password: 'qwer' });
    expect(res).toHaveHTTPStatus(302);
  });
})
