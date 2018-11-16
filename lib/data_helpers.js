"use strict";


module.exports = function makeDataHelpers(knex) {
    return {
        //Example
        getUsers: function (callback){
            knex
            .select("*")
            .from("users")
            .then((results) => {
                callback(results);
            })
            .catch((error) => {
                console.log(error);
            })
        },

        // Get all categories
        getCategories: function(callback) {
            knex
            .select("*")
            .from("categories")
            .then((results) => {
                    callback(results);
            });
        },

        // Gets all points from a given category.
        // TODO: Figure out if this needs to return object or ID
        getPoints: function(categoryId, callback) {
          knex('points')
            .where('categories_id',categoryId)
            .then((results) => {
              callback(results);
            })
            .catch((err) => {
              console.error(err);
            });
        },

        // Adds a point to a category.
        addPoint: function(pointData, callback) {
          knex('points')
            .insert(pointData)
          .then((results) => {
            callback(results);
          })
          .catch((err) => {
            console.error(err);
          });
        },

        // Deletes a point from a category.
        deletePoint: function(pointId, callback) {
          knex('points').where('id', pointId).del()
          .then((results) => {
            callback(results);
          })
          .catch((err) => {
            console.error(err);
          });
        },

        // Either adds or deletes a like from the likes table based on whether
        // the user had previously liked it.
        toggleLike: function(userId, categoryId, callback) {
          // Query database to find out if user/category exists in the table
          knex('likes')
            .whereRaw('(users_id, categories_id) = ((?, ?))'
              , [userId, categoryId])
            .then((results) => {
              if(Object.keys(results).length === 1) {

                // Delete row from table when the entry already exists.
                knex('likes')
                  .whereRaw('(users_id, categories_id) = ((?, ?))'
                    , [userId, categoryId])
                  .del()
                  .then((delete_results) => {
                    callback(delete_results);
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              } else {

                // Insert row into table when the entry does not exist.
                knex('likes')
                  .insert({users_id: userId, categories_id: categoryId})
                  .then((insert_results) => {
                    callback(insert_results);
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }
            })
            .catch((err) => {
              console.error(err);
            })
        },

        // Returns list of categories_ids based off of users_id likes.
        getLikes: function(userId, callback) {
          knex('likes')
          .select(knex.raw('ARRAY_AGG(categories_id) as likes'))
          .where('users_id', userId)
          .then((results) => {
            callback(results[0].likes);
          })
          .catch((err) => {
            console.error(err);
          });
        },

        // Adds a user to the contributes table.
        addContributes: function(userId, categoryId, callback) {
          knex('contributes')
            .insert({users_id: userId, categories_id: categoryId})
            .then((insert_results) => {
              callback(insert_results);
            })
            .catch((err) => {
              console.error(err);
            });
        },

        // Returns an array of categories_ids based off of user_id contributes.
        getContributes: function(userId, callback) {
          knex('contributes')
          .select(knex.raw('ARRAY_AGG(categories_id) as contributes'))
          .where('users_id', userId)
          .then((results) => {
            callback(results[0].contributes);
          })
          .catch((err) => {
            console.error(err);
          });
        },

        // Get a category by ID.
        getCategoriesByID: function(categoryID, callback) {
            knex
            .select("*")
            .from("categories")
            .where('id', categoryID)
            .then((results) => {
                callback(results);
            })
            .catch((err) => {
              console.error(err);
            })
        },

        // Create new category.
        addCategory: function(category, callback) {
            knex('categories')
            .insert(category)
            .then((results) => {
                callback(results);
            })
            .catch((err) => {
              console.error(err);
            });
        },

        // Delete category by ID.
        deleteCategory: function (categoryID, callback){
            knex('categories')
            .where('id', categoryID)
            .del()
            .then((results) => {
                callback(results);
            })
            .catch((err) => {
              console.error(err);
            });
        },
    }
}
