
exports.up = function(knex, Promise) {
  return knex.schema.table('points', function(table) {
    table .string('place_id');
});
};

exports.down = function(knex, Promise) {
return knex.schema.table('points', function(table) {
    table.dropColumn('place_id');
  });
};