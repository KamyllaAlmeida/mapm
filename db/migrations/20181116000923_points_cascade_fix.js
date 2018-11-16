
exports.up = function(knex, Promise) {
  return Promise.all ([
    knex.schema.dropTable('points'),
    knex.schema.createTable('points', function(table) {
      table.increments();
      table.string('title');
      table.string('image');
      table.string('description');
      table.float('lat');
      table.float('long');
      table.integer('categories_id');
      table.foreign('categories_id').references('categories.id').onDelete('CASCADE');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all ([
    knex.schema.dropTable('points'),
    knex.schema.createTable('points', function(table) {
      table.increments();
      table.string('title');
      table.string('image');
      table.string('description');
      table.float('lat');
      table.float('long');
      table.integer('categories_id');
      table.foreign('categories_id').references('categories.id');
    }),
  ]);
};
