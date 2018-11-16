
// Filename starts with _ to ensure that this seed runs before the elements that require it for
// foreign keys

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('categories').insert({
          id: 1,
          name: 'sushi restaurants',
          description: 'Favorite sushi restaurants in Vancouver.',
          image: 'https://placekitten.com/408/287'}),
        knex('categories').insert({
          id: 2,
          name: 'pizza restaurants',
          description: 'Favorite pizza restaurants in Vancouver.',
          image: 'https://placekitten.com/200/287'}),
        knex('categories').insert({
          id: 3,
          name: 'indian restaurants',
          description: 'Favorite Indian restaurants in Vancouver.',
          image: 'https://placekitten.com/200/287'}),
      ]);
    });
};
