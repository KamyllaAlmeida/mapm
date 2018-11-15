
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('points').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('points').insert({
          id: 1 ,
          categories_id: 1,
          title: 'Miku Sushi',
          description: 'Miku Sushi Description',
          image: 'https://www.placecage.com/g/155/300',
          lat: 49.287047,
          long: -123.112852
        }),
        knex('points').insert({
          id: 2,
          categories_id: 1,
          title: 'Domo Sushi',
          description: 'Domo Sushi Description',
          image: 'https://www.placecage.com/300/200',
          lat: 49.287327,
          long: -123.123570
        }),
        knex('points').insert({
          id: 3,
          categories_id: 2,
          title: 'Ignite Pizzaria',
          description: 'Ignite Pizzaria Description',
          image: 'https://www.placecage.com/c/140/200',
          lat: 49.284767,
          long: -123.111164
        }),
        knex('points').insert({
          id: 4,
          categories_id: 2,
          title: 'Pizza 2001',
          description: 'Pizza 2001 Description',
          image: 'https://www.stevensegallery.com/140/200',
          lat: 49.284028,
          long: -123.113586
        }),
        knex('points').insert({
          id: 5,
          categories_id: 2,
          title: 'Pizza Garden',
          description: 'Pizza Garden Description',
          image: 'https://www.stevensegallery.com/300/200',
          lat: 49.280190,
          long: -123.120886
        }),
        knex('points').insert({
          id: 6,
          categories_id: 3,
          title: 'Sitar Restaurant',
          description: 'Sitar Restaurant Description',
          image: 'https://www.stevensegallery.com/460/300',
          lat: 49.283160,
          long: -123.104020
        }),
      ]);
    });
};
