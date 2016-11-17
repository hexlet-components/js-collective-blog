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
})
