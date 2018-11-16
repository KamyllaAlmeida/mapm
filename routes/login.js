"use strict";

const express = require('express');
const router  = express.Router();

module.exports = function(DataHelpers) {

    //Display login page
    router.get("/", (req, res) => {
        res.json({1:1});
    });

    //For logging in authenticated user
    router.get("/:id", (req, res) => {
        req.session.user_id = req.params.id;
        res.redirect('/');
    });

  return router;

}
