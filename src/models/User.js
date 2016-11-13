// @flow

export default class {
  constructor(nickname, passwordDigest) {
    this.nickname = nickname;
    this.passwordDigest = passwordDigest;
  }

  isGuest() {
    return false;
  }
}
