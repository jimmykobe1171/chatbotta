var express = require('express')
var router = express.Router()


router.get('/schools/', function (req, res) {
  res.send('get schools');
})

router.get('/school/:schoolId/', function (req, res) {
  res.send('get school: ' + req.params['schoolId']);
})

export default router;
