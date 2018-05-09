var express = require('express');
var router = express.Router();
var promise = require('bluebird');
var response = require('../helpers/response');

// Initialization Options
var options = {
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:123456@127.0.0.1:5432/japonic'; //'postgres://username:password@servername:port/databaseName';
var db = pgp(connectionString);
router.get('/', (req, res) => {
  res.json({ sessionID: 'req.sessionID', session: 'req.session' });
});

router.get('/companies', (req, res) => {
  const limit = parseInt(req.query.limit);
  const pageNum = parseInt(req.query.page_number);
  if (!limit) {
    limit = 20;
  }
  if (!pageNum) {
    pageNum = 1;
  }
  db.any('SELECT * FROM auctions$maker ORDER BY id LIMIT $1 OFFSET $2', [limit, pageNum])
    .then(function (data) {
      res.json(response.result(data, 1, "successfully retrieved companies"));
    })
    .catch(function (err) {
      return res
                .status(404)
                .json(response.result({}, 0, err));
    });
});

router.get('/models', (req, res) => {
  const limit = parseInt(req.query.limit);
  const pageNum = parseInt(req.query.page_number);
  console.log(pageNum);
  const makerId = req.query.company_id;
  if (!limit) {
    limit = 20;
  }
  if (!pageNum) {
    pageNum = 1;
  }
  var queryStr = "SELECT t1.* FROM auctions$model t1  ";
  var queryDict = {
    limit: limit,
    pageNum: pageNum
  }
  if (makerId) {
    queryStr = queryStr + " INNER JOIN auctions$model_maker t2 on t2.auctions$modelid = t1.id  WHERE t2.auctions$makerid = $/makerId/ ";
    queryDict['makerId'] = makerId;
  } 

  queryStr = queryStr + " ORDER BY id LIMIT $/limit/ OFFSET $/pageNum/ ";
  const query = pgp.as.format(queryStr, queryDict);
  console.log(query);

  db.any(query)
    .then(function (data) {
      res.json(response.result(data, 1, "successfully retrieved models"));
    })
    .catch(function (err) {
      return res
                .status(404)
                .json(response.result({}, 0, err));
    });
});

router.get('/lots', (req, res) => {
  const limit = parseInt(req.query.limit);
  const pageNum = parseInt(req.query.page_number);
  const companyName = req.query.company_name_en;
  const modelName = req.query.model_name_en;
  const modelYearFrom = req.query.model_year_en_from;
  const modelYearTo = req.query.model_year_en_to;
  const lotDate = req.query.lot_date;

  if (!limit) {
    limit = 20;
  }
  if (!pageNum) {
    pageNum = 1;
  }

  var queryStr = "SELECT * FROM auctions$lot WHERE ";
  var queryDict = {
    limit: limit,
    pageNum: pageNum
  }

  if (companyName) {
    queryStr = queryStr + " company_en = $/companyName/ ";
    queryDict['companyName'] = companyName;
  }else {
    return res
              .status(404)
              .json(response.result({}, 0, 'company name is required'));
  }

  if (modelName) {
    queryStr = queryStr + " AND model_name_en = $/modelName/ ";
    queryDict['modelName'] = modelName;
  }else {
    return res
              .status(404)
              .json(response.result({}, 0, 'model name is required'));
  }

  if (modelYearFrom) {
    queryStr = queryStr + " AND model_year_en >= $/modelYearFrom/ ";
    queryDict['modelYearFrom'] = modelYearFrom;
  }

  if (modelYearTo) {
    queryStr = queryStr + " AND model_year_en <= $/modelYearTo/ ";
    queryDict['modelYearTo'] = modelYearTo;
  }

  if (lotDate) {
    const nextDate = 
    queryStr = queryStr + " AND createddate >= $/lotDate/ AND createddate < (DATE $/lotDate/ + INTEGER '1') ";
    queryDict['lotDate'] = lotDate;
  }

  queryStr = queryStr + " ORDER BY id LIMIT $/limit/ OFFSET $/pageNum/ ";
  const query = pgp.as.format(queryStr, queryDict);
  console.log(query);
//date '2001-09-28' + integer '7'

  db.any(query)
    .then(function (data) {
      res.json(response.result(data, 1, "successfully retrieved lots"));
    })
    .catch(function (err) {
      return res
                .status(404)
                .json(response.result({}, 0, err));
    });
});

module.exports = router;