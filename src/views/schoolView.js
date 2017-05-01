import express from 'express';
import { School } from '../data/models';

// const express = require('express');
const router = express.Router();

router.get('/schools/', (req, res) => {
  School.findAll({ attributes: ['id', 'name'] }).then((schools) => {
    res.json(schools);
  }).catch((err) => {
    res.status(400).json({ error: err });
    // res.status(400).json({ error: 'query schools failed!' });
  });
});

router.get('/school/:schoolId/', (req, res) => {
  School.findOne({
    attributes: ['id', 'name'],
    where: { id: req.params.schoolId },
  }).then((sch) => {
    res.json(sch);
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
});

export default router;
