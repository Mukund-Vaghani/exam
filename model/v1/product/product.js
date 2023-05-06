const common = require('../../../config/common');
var con = require('../../../config/database');
var global = require('../../../config/constant');
var middleware = require('../../../middleware/validation');
var asyncLoop = require('node-async-loop');
const e = require('express');

var product = {

    addToCart: function (request, callback) {
        var sql = `INSERT INTO tbl_cart SET ?`;
        var insertObj = {
            user_id: request.user_id,
            product_id: request.product_id,
            cutting_id: (request.cutting_id != undefined && request.cutting_id != '') ? request.cutting_id : null,
            sub_total: request.sub_total,
            unit: request.unit,
            price: request.price
        };
        con.query(sql, [insertObj], function (err, result) {
            if (!err) {
                callback("1", { keyword: "product added to the cart!", content: {} }, null);
            } else {
                callback("0", { keyword: "rest_keywords_nodata", content: {} }, null)
            };
        });
    },

    placeOrder: function(request,id,callback){
        con.query(`select * from tbl_cart where user_id=?`,[id], function(err,result){
            if(!err && result.length>0){
                console.log(result[0].product_id);
                callback('1','reset_keyword_add_message',result);
            }else{
                callback('0','reset_keyword_something_wrong_message',null)
            }
        })
    },
}

module.exports = product