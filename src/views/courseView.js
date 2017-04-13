// const express = require('express');
import express from 'express';
// import { Course, UserCourse } from '../data/models';
import { Course } from '../data/models';


const router = express.Router();

// router.get('/courses/:userId/', (req, res) => {
router.get('/courses/', (req, res) => {
  Course.findAll({
    attributes: ['id', 'name', 'description'],
    // where: { UserId: req.params.userId },
    // include: [{
    //   model: crs,
    //   as: 'course_info',
    //   through: {
    //     attributes: ['id', 'name', 'description'],
    //     where: {id = UserId}
    //   }
    // }]
    // include: [usr]
  }).then((courses) => {
    res.json(courses);
  }).catch((err) => {
    res.status(400).json({ error: err });
  });

  // crs.findAll({
  //   attributes: ['id', 'name', 'description'],
  //   include: [usr]
  // }).then(function (courses) {
  //   res.json(courses);
  // })
});

export default router;
