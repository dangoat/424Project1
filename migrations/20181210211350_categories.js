
exports.up = function(knex) {
  return knex.schema.createTable('categories', function (t) {
    t.string('CategoryName').primary()
    t.string('Parent')
  })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('categories')
}
