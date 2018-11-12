const knex = require('knex')(require('./knexfile'))

module.exports = {
  createUser (data) {
  	username = data.username
  	password = data.password
    console.log(`Add user ${username} with password ${password}`)
    return knex('user').insert({
      username,
      password
    })
  }
}