const express = require('express');


const router = express.Router();

router.get('/course/', (req, res) => {
  res.send('get courses');
});

router.get('/course/:courseId/', (req, res) => {
  res.send(`get course: ${req.params.courseId}`);
});

export default router;
