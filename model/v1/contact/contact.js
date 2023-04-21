const common = require('../../../config/common');
var con = require('../../../config/database');
var global = require('../../../config/constant');
var middleware = require('../../../middleware/validation');
var asyncLoop = require('node-async-loop');
const e = require('express');

var contact = {


contactUs: function(request,id,callback){

    con.query(`INSERT INTO tbl_contact_us(user_id, title, email, messege) VALUES("${id}", "${request.title}", "${request.email}", "${request.message}")`, function (error, result) {
        if (!error) {
            var id = result.insertId;

            asyncLoop(request.image, (item, next) => {
                var images = {
                    contact_us_id: id,
                    image: item
                }

                con.query("INSERT INTO tbl_contact_image SET ?", [images], (error, result) => {
                    if (!error) {
                        next()
                    } else {
                        next()
                    }
                })
            }, () => {
            post.contactUsDetail(id,function(contact_data){
                if(contact_data){
                    callback("1","place add",contact_data)
                }else{
                    callback("0","reset_keyword_something_wrong_message",error)
                }
            });
            })
        } else {
            callback('0', "reset_keyword_something_wrong_message", error);
        }
    })
},

contactUsDetail: function(id, callback){
    con.query(`SELECT * FROM tbl_contact_us WHERE id = ?`,[id],function(error,result){
        if(!error){
            con.query(`SELECT *,CONCAT('${global.BASE_URL}','${global.CONTACT_URL}',image) as contact_image FROM tbl_contact_image WHERE contact_us_id = ?`,[id],function(error,image){
                if(!error){
                    result[0].image = image;
                    callback(result);
                }else{
                    callback(null);
                }
            })
        }else{
            callback(null);
        }
    })
}

}

module.exports = contact