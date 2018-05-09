var express = require('express');
var router = express.Router();
var promise = require('bluebird');
var response = require('../helpers/response');

// Initialization Options
var options = {
  promiseLib: promise,
  error: (error, e) => {
    if (e.cn) {
      // A connection-related error;
      //
      // Connections are reported back with the password hashed,
      // for safe errors logging, without exposing passwords.
      console.log('CN: ', e.cn);
      console.log('EVENT', error.message ||  error);
    }
  }
};

var pgp = require('pg-promise')(options);
// var connectionString = 'postgres://postgres:123456@127.0.0.1:5432/japonic'; //'postgres://username:password@servername:port/databaseName';
var connectionString = 'postgres://postgres:Welkom01@34.253.34.86:5432/Japonic3'; //'postgres://username:password@servername:port/databaseName';
var db = pgp(connectionString);
router.get('/', (req, res) => {
  console.log('db =>', db);
  var limit = parseInt(req.query.limit);
  var pageNum = parseInt(req.query.page_number);
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
  // res.json({ sessionID: 'req.sessionID', session: 'req.session' });
});

router.get('/companies', (req, res) => {
  var limit = parseInt(req.query.limit);
  var pageNum = parseInt(req.query.page_number);
  if (!limit) {
    limit = 20;
  }
  if (!pageNum) {
    pageNum = 1;
  }
  db.any('SELECT name FROM auctions$maker ORDER BY id LIMIT $1 OFFSET $2', [limit, pageNum])
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
  var limit = parseInt(req.query.limit);
  var pageNum = parseInt(req.query.page_number);
  console.log(pageNum);
  var makerName = req.query.company_name;
  if (!limit) {
    limit = 20;
  }
  if (!pageNum) {
    pageNum = 1;
  }
  // SELECT T4.* FROM (SELECT * FROM auctions$maker T1 LEFT JOIN auctions$model_maker T2 ON T1.id = T2.auctions$makerid WHERE T1.name='NISSAN'  ) AS T3 LEFT JOIN auctions$model T4 ON T4.ID=T3.auctions$modelid ;
  var queryStr = "SELECT T4.name FROM (SELECT * FROM auctions$maker T1 LEFT JOIN auctions$model_maker T2 ON T1.id = T2.auctions$makerid WHERE T1.name=$/makerName/ ) AS T3 LEFT JOIN auctions$model T4 ON T4.ID=T3.auctions$modelid  ORDER BY T4.id LIMIT $/limit/ OFFSET $/pageNum/  ";
  var queryDict = {
    limit: limit,
    pageNum: pageNum
  }
  if (makerName) {
    queryDict['makerName'] = makerName;
  }else {
    return res
      .status(404)
      .json(response.result({}, 0, 'company name is required'));
  }

  queryStr = queryStr + "";
  var query = pgp.as.format(queryStr, queryDict);
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
  var limit = parseInt(req.query.limit);
  var pageNum = parseInt(req.query.page_number);
  var companyName = req.query.company_name_en;
  var modelName = req.query.model_name_en;
  var modelYearFrom = req.query.model_year_en_from;
  var modelYearTo = req.query.model_year_en_to;
  var lotDate = req.query.lot_date;

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
  } else {
    return res
      .status(404)
      .json(response.result({}, 0, 'company name is required'));
  }

  if (modelName) {
    queryStr = queryStr + " AND model_name_en = $/modelName/ ";
    queryDict['modelName'] = modelName;
  } else {
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
    var nextDate =
      queryStr = queryStr + " AND date >= $/lotDate/ AND date < (DATE $/lotDate/ + INTEGER '1') ";
    queryDict['lotDate'] = lotDate;
  }

  queryStr = queryStr + " ORDER BY id LIMIT $/limit/ OFFSET $/pageNum/ ";
  var query = pgp.as.format(queryStr, queryDict);
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