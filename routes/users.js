"use strict";

const express = require('express');
const router  = express.Router();

module.exports = function(DataHelpers) {
  //TODO: Delete this route before production.
  //Example page
  router.get("/", (req, res) => {
    DataHelpers.getUsers((results) => {
      res.json(results);
    });
  });

  //Display users profile
  router.get("/:id", (req, res) => {
    //TODO: These can run concurrently using a callback control flow
    let userId = req.params.id;

    DataHelpers.getUserById(userId, (userResults) => {
      let userInfo = userResults;

      DataHelpers.getContributes(userId, (contributesResults) => {
        let contributesInfo = contributesResults;

        DataHelpers.getLikes(userId, (likesResults) => {
          let likesInfo = likesResults;

          res.render('users',
            {
              user: userInfo,
              likes: likesInfo,
              contributes: contributesInfo,
              userIsAuthenticated: req.userAuthenticated,
              username: req.session.user_id,
            }
          );
        });
      });
    });
  });

  //TODO: Both of these routes can probably be deleted since we are not
  //      registering users.

  //Save user
  router.post("/", (req, res) => {
    res.json({2:2});
  });

  // New user
  router.get("/register", (req, res) => {
    res.json({3:3});
  });

  return router;
};
