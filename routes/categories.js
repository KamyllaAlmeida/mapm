"use strict";

const express = require('express');
const router  = express.Router();

module.exports = function(DataHelpers) {

    // Get all categories.
    router.get("/", (req, res) => {
        DataHelpers.getCategories((results) => {
            res.json(results);
        });

     // After select a Category show this page
    router.get("/:id", (req, res) => {
        let categoryId = req.params.id;
        let categoryData, pointData;
          DataHelpers.getCategoryByID(categoryId, (results) => {
            let categoryData = results;
            DataHelpers.getPoints(categoryId, (results) => {
              let pointData = results;
              res.json({category_data: categoryData, point_data: pointData});
            });
          });
    });

    //New Category Page
    router.get("/new", (req, res) => {
        res.render("edit-new");
        //res.json({1:1});
    });

    //Saving New Category
    router.post("/", (req, res) => {
        let image = req.body.image;

        let category =  {
            name : req.body.title,
            description: req.body.description,
            //image : req.body.image
        }

        DataHelpers.addCategory((category) => {
            res.json(category);
        });

        res.redirect("/api/categories");

        //console.log("Deu certo");

    });

    //After select a Category show this page
    router.get("/:id", (req, res) => {
        let id = req.params.id;
        res.json({"id":id});
    });

    //Like category
    router.put("/:id/like", (req, res) => {
      if (req.userAuthenticated) {
        let userId = req.session.user_id;
        let categoryId = req.params.id;
        DataHelpers.toggleLike(userId, categoryId, (results) => {
          console.log(results);
          res.redirect('/');
        });
      } else {
        res.redirect('/');
      }
    });

    //update category
    router.put("/:id/edit", (req, res) => {
        res.json({"id":id});
    });

  return router;
}
