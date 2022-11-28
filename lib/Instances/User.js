export default class User {
  constructor(data) {
    this.username = data.login;
    this.displayName = data.display_name;
    this.id = data.id;
  }
}
