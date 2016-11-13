// @flow

export default class Post {
  static id = 1;

  constructor(user, title, body) {
    this.id = Post.id++;
    this.user = user;
    this.title = title;
    this.body = body;
  }
}
