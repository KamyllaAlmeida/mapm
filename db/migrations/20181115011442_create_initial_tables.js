
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table) {
      table.string('username');
      table.string('password');
    }),
    knex.schema.createTable('categories', function(table) {
      table.increments().('id');
      table.string('name');
      table.string('description');
    }),
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
    knex.schema.createTable('likes', function(table) {
      table.integer('users_id');
      table.foreign('users_id').references('users.id');
      table.integer('categories_id');
      table.foreign('categories_id').references('categories.id');
      table.primary(['users_id', 'categories_id']);
    }),
    knex.schema.createTable('contributing', function(table) {
      table.integer('users_id');
      table.foreign('users_id').references('users.id');
      table.integer('categories_id');
      table.foreign('categories_id').references('categories.id');
      table.primary(['users_id', 'categories_id']);
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('contributing'),
    knex.schema.dropTable('points'),
    knex.schema.dropTable('likes'),
    knex.schema.table('users', function(table) {
      table.dropColumn('username');
      table.dropColumn('password');
    }),
    knex.schema.dropTable('categories'),
  ]);
};
