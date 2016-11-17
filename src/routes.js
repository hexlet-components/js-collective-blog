// @flow

import log from './logger';
import encrypt from './encrypt';
import User from './models/User';
import Post from './models/Post';
import Guest from './models/Guest';
import NotFoundError from './errors/NotFoundError';

const initState = () => {
  const admin = new User('admin', encrypt('qwerty'));
  const posts = [
    new Post(admin, 'how to write code', 'so, you need text editor'),
    new Post(admin, 'how to debug', 'use your mind, luke'),
  ];
  return { users: [admin], posts };
};

const state = initState();

const requiredAuth = (req, res, next) => {
  if (res.locals.currentUser.isGuest()) {
    const error = new Error();
    error.status = 403;
    next(error);
  } else {
    next();
  }
};

export default app => {
  app.use((req, res, next) => {
    log('body', req.body);
    next();
  });

  app.use((req, res, next) => {
    if (req.session && req.session.nickname) {
      const nickname = req.session.nickname;
      res.locals.currentUser = state.users.find(user => user.nickname === nickname);
    } else {
      res.locals.currentUser = new Guest();
    }
    next();
  });

  app.get('/', (req, res) => {
    const posts = state.posts;

    res.render('index', { posts });
  });

  app.get('/posts/:id', (req, res, next) => {
    const post = state.posts.find(post => post.id.toString() === req.params.id);
    if (post) {
      res.render('posts/show', { post });
    } else {
      next(new NotFoundError());
    }
  });

  app.get('/users/new', (req, res) => {
    res.render('users/new', { form: {}, errors: {} });
  });

  app.post('/users', (req, res) => {
    const { nickname, password } = req.body;

    const errors = {};
    if (!nickname) {
      errors.nickname = "Can't be blank";
    } else {
      const uniq = state.users.find(user => user.nickname === nickname) === undefined;
      if (!uniq) {
        errors.nickname = 'Already exist';
      }
    }

    if (!password) {
      errors.password = "Can't be blank";
    }

    if (Object.keys(errors).length === 0) {
      const user = new User(nickname, encrypt(password));
      state.users.push(user);
      req.flash('success', 'Success!');
      res.redirect('/');
      return;
    }

    res.status(422);
    res.render('users/new', { form: req.body, errors });
  });

  app.get('/session/new', (req, res) => {
    res.render('session/new', { form: {} });
  });

  app.post('/session', (req, res) => {
    const { nickname, password } = req.body;
    const user = state.users.find(user => user.nickname === nickname);
    if (user && user.passwordDigest === encrypt(password)) {
      req.session.nickname = user.nickname;
      req.flash('info', `Welcome, ${user.nickname}!`);
      res.redirect('/');
      return;
    }
    res.status(422);
    res.render('session/new', { form: req.body, error: 'Invalid nickname or password' });
  });

  app.delete('/session', (req, res) => {
    req.flash('info', `Good bye, ${res.locals.currentUser.nickname}`);
    delete req.session.nickname;
    res.redirect('/');
  });

  app.get('/my/posts/new', requiredAuth, (req, res) => {
    res.render('my/posts/new', { form: {}, errors: {} });
  });

  app.get('/my/posts', requiredAuth, (req, res) => {
    const posts = state.posts.filter(post => post.user = res.locals.currentUser);
    res.render('my/posts/index', { posts });
  });

  app.get('/my/posts/:id/edit', requiredAuth, (req, res, next) => {
    const post = state.posts.find(post =>
      post.user === res.locals.currentUser && post.id.toString() === req.params.id);
    if (post) {
      res.render('my/posts/edit', { post, form: post, errors: {} });
    } else {
      next(new NotFoundError());
    }
  });

  app.post('/my/posts', requiredAuth, (req, res) => {
    const { title, body } = req.body;

    const errors = {};
    if (!title) {
      errors.title = "Can't be blank";
    }

    if (!body) {
      errors.body = "Can't be blank";
    }

    if (Object.keys(errors).length === 0) {
      const post = new Post(res.locals.currentUser, title, body);
      state.posts.push(post);
      req.flash('success', 'Success!');
      res.redirect(`/my/posts/${post.id}/edit`);
      return;
    }

    res.status(422);
    res.render('my/posts/new', { form: req.body, errors });
  });

  app.patch('/my/posts/:id', requiredAuth, (req, res, next) => {
    const post = state.posts.find(post =>
      post.user === res.locals.currentUser && post.id.toString() === req.params.id);
    if (post) {
      const { title, body } = req.body;

      const errors = {};
      if (!title) {
        errors.title = "Can't be blank";
      }

      if (!body) {
        errors.body = "Can't be blank";
      }

      if (Object.keys(errors).length === 0) {
        post.title = title;
        post.body = body;
        req.flash('success', 'Success!');
        res.redirect(`/my/posts/${post.id}/edit`);
        return;
      }

      res.status(422);
      res.render('my/posts/edit', { post, form: req.body, errors });
    } else {
      next(new NotFoundError());
    }
  });

  app.delete('/my/posts/:id', requiredAuth, (req, res) => {
    state.posts = state.posts.filter(post =>
      !(post.user === res.locals.currentUser && post.id.toString() === req.params.id));
    res.redirect('/my/posts');
  });

  app.use((req, res, next) => {
    next(new NotFoundError());
  });

  app.use((err, req, res, next) => {
    log(err.message);
    res.status(err.status);
    switch (err.status) {
      case 403:
      case 404:
        res.render(err.status.toString());
        break;
      default:
        res.render('500');
    }
  });
};
