const express = require('express');
const router = express.Router();


router.get('/schools/', (req, res) => {
  res.send('get schools');
});

router.get('/school/:schoolId/', (req, res) => {
  res.send(`get school: ${req.params.schoolId}`);
});

export default router;
