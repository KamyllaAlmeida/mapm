"use strict";

const express = require('express');
const router  = express.Router();

module.exports = function(DataHelpers) {

    //Testing route
    router.get("/", (req, res) => {
        DataHelpers.getCategories((results) => {
            res.json(results);
        }); 
    }); 

    //After select a Category show this page
    router.get("/:id", (req, res) => {
        let id = req.params.id;
        res.json({"id":id});
    });

    //New Category Page
    router.get("/new", (req, res) => {
        res.json({1:1});
    });

    //Saving New Category
    router.post("/", (req, res) => {
        res.json({2:2});
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
