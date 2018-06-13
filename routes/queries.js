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
// var connectionString = 'postgres://postgres:123456@127.0.0.1:5432/japonic3'; //'postgres://username:password@servername:port/databaseName';
// var connectionString = 'postgres://postgres:Welkom01@34.243.192.210:5432/Japonic_DEV';
var connectionString = 'postgres://postgres:Welkom01@127.0.0.1:5432/Japonic_DEV';  
//'postgres://username:password@servername:port/databaseName';
var db = pgp(connectionString);
router.get('/', (req, res) => {
  res.json({ sessionID: 'req.sessionID', session: 'req.session' });
});

router.get('/companies', (req, res) => {
  
  db.any('SELECT t1.name FROM auctions$maker as t1 INNER JOIN auctions$lot as t2 ON t1.name=t2.company_en WHERE t2.result_num = 5  GROUP BY t1.id ORDER BY t1.name ASC')
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
  var makerName = req.query.company_name;
  
  // SELECT T4.* FROM (SELECT * FROM auctions$maker T1 LEFT JOIN auctions$model_maker T2 ON T1.id = T2.auctions$makerid WHERE T1.name='NISSAN'  ) AS T3 LEFT JOIN auctions$model T4 ON T4.ID=T3.auctions$modelid ;
  var queryStr = "SELECT T4.name FROM (SELECT * FROM auctions$maker T1 LEFT JOIN auctions$model_maker T2 ON T1.id = T2.auctions$makerid WHERE T1.name=$/makerName/ ) AS T3 LEFT JOIN auctions$model T4 ON T4.ID=T3.auctions$modelid INNER JOIN auctions$lot  T5 ON T5.model_name_en=T4.name AND T5.company_en=T3.name AND T5.result_num = 5 GROUP BY T4.id ORDER BY T4.name ASC ";
  var queryDict = {
  };
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
      console.log(data);
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
    pageNum = 0;
  }

  // var queryStr = "SELECT * FROM auctions$lot WHERE result_num = 5 ";
  var queryStr = "SELECT * FROM auctions$lot WHERE ";
  var queryDict = {
    limit: limit,
    pageNum: pageNum * limit
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

  queryStr = queryStr + " ORDER BY model_year_en DESC LIMIT $/limit/ OFFSET $/pageNum/ ";
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