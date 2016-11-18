// @flow

import matchers from 'jest-supertest-matchers';
import request from 'supertest';

import app from '../src/index';

describe('requests', () => {
  beforeAll(() => {
    jasmine.addMatchers(matchers);
  });

  it('GET /session/new', async () => {
    const res = await request(app)
      .get('/session/new');
    expect(res).toHaveHTTPStatus(200);
  });

  it('POST /session', async () => {
    const res = await request(app)
      .post('/session')
      .type('form')
      .send({ nickname: 'admin', password: 'qwerty' });
    expect(res).toHaveHTTPStatus(302);
  });

  it('POST /session (errors)', async () => {
    const res = await request(app)
      .post('/session')
      .type('form')
      .send({ nickname: 'admin', password: 'qwery' });
    expect(res).toHaveHTTPStatus(422);
  });

  it('DELETE /session', async () => {
    await request(app)
      .post('/session')
      .type('form')
      .send({ nickname: 'admin', password: 'qwerty' });

    const res = await request(app)
      .delete('/session');
    expect(res).toHaveHTTPStatus(302);
  });
});
