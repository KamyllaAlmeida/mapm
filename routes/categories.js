"use strict";

const express = require('express');
const router  = express.Router();

module.exports = function (DataHelpers) {

  //TESTING delete points test
  router.post('/delete/test/:id', (req, res) => {
    let pointId = req.body.test;
    console.log(pointId);
    //DataHelpers.deletePoint(pointId, (results) => {
      //console.log(results);
    //})        
  });

  // Get all categories.
  router.get('/', (req, res) => {
    DataHelpers.getCategories((results) => {
      res.json(results);
    });
  });


  //New Category Page
  router.get('/new', (req, res) => {
    res.render('edit-new');
    //res.json({1:1});
  });

  //Saving New Category
  router.post('/', (req, res) => {
    // I need to implement a function to save the image.

    let category =  {
      name : req.body.title,
      description: req.body.description,
      image : req.body.image
    };

    DataHelpers.addCategory(category, (results) => {
      //res.json(results);
      res.redirect(`/api/categories/${results}`);
    });
  });

  // After select a Category show this page
  router.get('/:id', (req, res) => {
    let categoryId = req.params.id;

    DataHelpers.getCategoryByID(categoryId, (results) => {
      let categoryData = results;

      DataHelpers.getPoints(categoryId, (results) => {
        let pointData = results;

        let templateVars = {
          category_data: categoryData, 
          point_data: pointData
        }        
        //res.json({category_data: categoryData, point_data: pointData});
        res.render('edit-new', templateVars);
      });
    });
  });


    //Like category
    router.put('/:id/like', (req, res) => {
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
    router.put('/:id/edit', (req, res) => {
      res.json({'id': req.params.id});
    });

  return router;
};
