// @flow

import request from 'supertest';

import log from '../src/logger'
import app from '../src/index';

describe('posts', () => {
  let cookie;
  beforeEach(async () => {
    const authRes = await request(app)
      .post('/session')
      .type('form')
      .send({ nickname: 'admin', password: 'qwerty' });
    cookie = authRes.headers['set-cookie'];
  });

  it('GET /my/posts/new', async () => {
    const res = await request(app)
      .get('/my/posts/new')
      .set('Cookie', cookie);
    expect(res.status).toBe(200);
  });

  it('POST /my/posts', async () => {
    const res = await request(app)
      .post('/my/posts')
      .type('form')
      .set('Cookie', cookie)
      .send({ title: 'post title', body: 'post body' });
    expect(res.status).toBe(302);
  });

  it('POST /my/posts (errors)', async () => {
    const res = await request(app)
      .post('/my/posts')
      .set('Cookie', cookie);
    expect(res.status).toBe(422);
  });

  it('GET /my/posts/:id/edit', async () => {
    const res1 = await request(app)
      .post('/my/posts')
      .type('form')
      .set('Cookie', cookie)
      .send({ title: 'post title', body: 'post body' });
    const url = res1.headers.location;
    const res2 = await request(app)
      .get(url)
      .set('Cookie', cookie);
    expect(res2.status).toBe(200);
  });

  it('PATCH /my/posts/:id', async () => {
    const res1 = await request(app)
      .post('/my/posts')
      .type('form')
      .set('Cookie', cookie)
      .send({ title: 'post title', body: 'post body' });
    const url = res1.headers.location.split('/').slice(0, -1).join('/');
    const res2 = await request(app)
      .patch(url)
      .type('form')
      .send({ title: 'new post title', body: 'new post body' })
      .set('Cookie', cookie);
    expect(res2.status).toBe(302);
  });

  it('PATCH /my/posts/:id (not found)', async () => {
    const res = await request(app)
      .patch('/my/posts/100/edit')
      .set('Cookie', cookie);
    expect(res.status).toBe(404);
  });

  it('PATCH /my/posts/:id (unproccessable entity)', async () => {
    const res1 = await request(app)
      .post('/my/posts')
      .type('form')
      .set('Cookie', cookie)
      .send({ title: 'post title', body: 'post body' });
    const url = res1.headers.location.split('/').slice(0, -1).join('/');
    const res2 = await request(app)
      .patch(url)
      .set('Cookie', cookie);
    expect(res2.status).toBe(422);
  });

  it('DELETE /my/posts/:id', async () => {
    const res1 = await request(app)
      .post('/my/posts')
      .type('form')
      .set('Cookie', cookie)
      .send({ title: 'post title', body: 'post body' });
    const url = res1.headers.location.split('/').slice(0, -1).join('/');
    const res2 = await request(app)
      .delete(url)
      .set('Cookie', cookie);
    expect(res2.status).toBe(302);

    const res3 = await request(app)
      .get(res1.headers.location)
      .set('Cookie', cookie);
    expect(res3.status).toBe(404);
  });
});
