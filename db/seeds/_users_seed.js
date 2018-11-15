
// Filename starts with _ to ensure that this seed runs before the elements that require it for
// foreign keys

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries.
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({
          id: 1,
          name: 'Adam',
          username: 'adam',
          password: 'password'}),
        knex('users').insert({id: 2,
          name: 'Jessica',
          username: 'jessica',
          password: 'password'}),
        knex('users').insert({
          id: 3,
          name: 'Kamylla',
          username: 'kamylla',
          password: 'password'}),
      ]);
    });
};
