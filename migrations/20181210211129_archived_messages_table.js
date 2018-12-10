
exports.up = function(knex) {
  return knex.schema.createTable('archived_message_table', function (t) {
    t.increments('MessageID').primary()
    t.integer('UserID').notNullable()
    t.string('Content').notNullable()
    t.date('StartTime')
    t.date('EndTime')
    t.string('Location').notNullable()
    t.integer('Range').notNullable()
    t.string('Categories').notNullable()
    t.binary('Media')
  })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('archived_message_table')
}
