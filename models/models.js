class Users {
  constructor(fullName, email, password) {
    if (!fullName) {
      throw new Error("The fullName field is missing");
    } else if (!email) {
      throw new Error("The email field is missing");
    } else if (!password) {
      throw new Error("The password field is missing");
    }
    this.fullName = fullName;
    this.email = email;
    this.password = this.hashPassword(password);
  }

  hashPassword(password) {
    const bcrypt = require("bcryptjs");
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}

module.exports = Users;
