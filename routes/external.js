var express = require('express');
var router = express.Router();
var request = require('superagent');
var responseResult = require('../helpers/response');
var baseUrl = 'http://75.125.226.218/xml/json?code=Nmdg45Kdhr7&sql=';



router.get('/companies', (req, res) => {
    request
        .get(baseUrl + 'select%20marka_name%20from%20main%20group%20by%20marka_name')
        .then(function (response) {
            // res.body, res.headers, res.status
            console.log(response.ok);
            if (response.ok) {
                var result = [];
                JSON.parse(response.text).forEach(element => {
                    var e = {
                        name: element['MARKA_NAME']
                    }
                    result.push(e);
                });
                res.json(responseResult.result(result, 1, "successfully retrieved companies"));
            } else {
                return res
                    .status(response.status)
                    .json(responseResult.result({}, 0, 'Unknown error'));
            }

        })
        .catch(function (err) {
            // err.message, err.response
            console.log(err);
            return res
                .status(404)
                .json(responseResult.result({}, 0, err));
        });
});

router.get('/models', (req, res) => {
    var makerName = req.query.company_name;
    var query = `select model_name from main where marka_name="${makerName}" group by model_name`;
    console.log(query);
    request
        .get(baseUrl + query)
        .then(function (response) {
            // res.body, res.headers, res.status
            console.log(response.ok);
            if (response.ok) {
                var result = [];
                JSON.parse(response.text).forEach(element => {
                    var e = {
                        name: element['MODEL_NAME']
                    }
                    result.push(e);
                });
                res.json(responseResult.result(result, 1, "successfully retrieved models"));

            } else {
                return res
                    .status(response.status)
                    .json(responseResult.result({}, 0, 'Unknown error'));
            }
        })
        .catch(function (err) {
            // err.message, err.response
            console.log(err);
            return res
                .status(404)
                .json(responseResult.result({}, 0, err));
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

    var queryStr = "SELECT * FROM main WHERE ";
    var query = "select * from main where ";

    if (companyName) {
        queryStr = queryStr + ` marka_name = "${companyName}" `;
    } else {
        return res
            .status(404)
            .json(response.result({}, 0, 'company name is required'));
    }

    if (modelName) {
        queryStr = queryStr + ` AND model_name = "${modelName}" `;
    }

    if (modelYearFrom) {
        queryStr = queryStr + ` AND year >= "${modelYearFrom}" `;
    }

    if (modelYearTo) {
        queryStr = queryStr + ` AND year <= "${modelYearTo}" `;
    }

    if (lotDate) { //BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY)  AND NOW()
        var nextDate =
            queryStr = queryStr + ` AND auction_date >= "${lotDate}" AND auction_date < DATE_SUB("${lotDate}", INTERVAL 1 DAY) `;
    }

    queryStr = queryStr + ` ORDER BY year DESC LIMIT ${limit * pageNum} , ${(pageNum + 1) * limit} `;

    console.log(queryStr);
    request
        .get(baseUrl + queryStr)
        .then(function (response) {
            console.log(response.ok);
            if (response.ok) {
                var result = [];
                JSON.parse(response.text).forEach(element => {
                    result.push(responseResult.convertedResult(element));
                });
                res.json(responseResult.result(result, 1, "successfully retrieved lots"));

            } else {
                return res
                    .status(response.status)
                    .json(responseResult.result({}, 0, 'Unknown error'));
            }
        })
        .catch(function (err) {
            // err.message, err.response
            console.log(err);
            return res
                .status(404)
                .json(responseResult.result({}, 0, err));
        });
});
module.exports = router;