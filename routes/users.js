"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (DataHelpers) => {

  //Example page
  router.get("/", (req, res) => {
    DataHelpers.getUsers((results) => {
        res.json(results);
    });
  }); 

  //Display users profile
  router.get("/:id", (req, res) => {
    res.json({1:1});
  });

  //Save user
  router.post("/", (req, res) => {
    res.json({2:2});
  });

  //New user
  router.get("/register", (req, res) => {
    res.json({3:3});
  });

  return router;
}
