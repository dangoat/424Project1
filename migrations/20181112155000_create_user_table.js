exports.up = function (knex) {
  return knex.schema.createTable('user', function (t) {
    t.increments('id').primary()
    t.string('name').notNullable()
    t.string('email').notNullable()
    t.string('password').notNullable()
    t.timestamp('recorded', true)
    t.boolean('publisher').notNullable()
  })
}
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user')
}