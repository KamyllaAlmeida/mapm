"use strict";

const express = require('express');
const router  = express.Router();

module.exports = function(DataHelpers) {

    router.get("/test", (req, res) => {
      let newUser =
      {
        name: 'Adam',
        username: 'adam',
        password: 'password'
      };

      DataHelpers.addUser(newUser, (results) => {
        console.log(results);
        res.redirect('/');
      });
    });

    //
    router.get("/", (req, res) => {
        DataHelpers.getCategories((results) => {
            res.json(results);
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
        let id = req.params.id;
        res.json({"id":id});
    });

    //update category
    router.put("/:id/edit", (req, res) => {
        res.json({"id":id});
    });

  return router;
}
