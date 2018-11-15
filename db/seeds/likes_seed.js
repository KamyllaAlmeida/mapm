
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('likes').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('likes').insert({users_id: 1 , categories_id: 1 }),
        knex('likes').insert({users_id: 1 , categories_id: 3 }),
        knex('likes').insert({users_id: 2 , categories_id: 1 }),
        knex('likes').insert({users_id: 2 , categories_id: 2 }),
        knex('likes').insert({users_id: 2 , categories_id: 3 }),
        knex('likes').insert({users_id: 3 , categories_id: 1 }),
        knex('likes').insert({users_id: 3 , categories_id: 2 }),
        knex('likes').insert({users_id: 3 , categories_id: 3 }),
      ]);
    });
};
