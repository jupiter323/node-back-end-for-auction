var express = require('express');
var router = express.Router();

var queries = require('./queries');

router.use('/api', queries);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
