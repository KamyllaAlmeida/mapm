
exports.up = function(knex, Promise) {
  return Promise.all ([
    knex.schema.dropTable('likes'),
    knex.schema.dropTable('contributing'),
    knex.schema.createTable('likes', function(table) {
      table.integer('users_id');
      table.foreign('users_id').references('users.id').onDelete('CASCADE');
      table.integer('categories_id');
      table.foreign('categories_id').references('categories.id').onDelete('CASCADE');
      table.primary(['users_id', 'categories_id']);
    }),
    knex.schema.createTable('contributes', function(table) {
      table.integer('users_id');
      table.foreign('users_id').references('users.id').onDelete('CASCADE');
      table.integer('categories_id');
      table.foreign('categories_id').references('categories.id').onDelete('CASCADE');
      table.primary(['users_id', 'categories_id']);
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all ([
    knex.schema.dropTable('likes'),
    knex.schema.dropTable('contributes'),
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
