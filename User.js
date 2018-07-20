
function User (user_id, hashpass, service, name) {

    this.user_id = user_id;

    this.pass = hashpass;

    this.service = service;

    this.name = name;

}

module.exports = User;

