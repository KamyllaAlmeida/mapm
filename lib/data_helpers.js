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
            });
        },

        //Testing, I have to change users to categories.
        getCategories: function(callback) {
            knex('users')
            .where('id', 1)
            .then((results) => {
                    callback(results);
            });

        },

        // Gets all points from a given category.
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
        // TODO: The destructure on the insert might not be necessary.
        addPoint: function(pointData, callback) {
          knex('points')
            .insert({...pointData})
          .then((result) => {
            callback(results);
          })
          .catch((err) => {
            console.error(err);
          });
        },

        // Deletes a point from a category.
        deletePoint: function(pointId) {
          knex('points').where(id, pointId).del()
          .then((results) => {
            callback(results);
          })
          .catch((err) => {
            console.error(err);
          });
        },

    }
}
