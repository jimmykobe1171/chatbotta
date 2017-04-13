const express = require('express');


const router = express.Router();

router.get('/material/', (req, res) => {
  res.send('get lecture materials');
});

router.get('/material/:materialId/', (req, res) => {
  res.send(`get lecture material: ${req.params.materialId}`);
});

export default router;
