"use strict";

const express = require('express');
const router  = express.Router();

module.exports = function (DataHelpers) {

  router.post('/:id', (req, res) => {
    let pointId = req.body.id;
    DataHelpers.deletePoint(pointId, (results) => {
      console.log
      })        
  });

  return router;
};