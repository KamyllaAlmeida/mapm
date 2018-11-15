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
                
        } 
    
    }
}