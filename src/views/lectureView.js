const express = require('express');


const router = express.Router();

router.get('/lecture/', (req, res) => {
  res.send('get lectures');
});

router.get('/lecture/:lectureId/', (req, res) => {
  res.send(`get lecture: ${req.params.lectureId}`);
});

export default router;
