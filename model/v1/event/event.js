const common = require('../../../config/common');
var con = require('../../../config/database');
var global = require('../../../config/constant');
var middleware = require('../../../middleware/validation');
var asyncLoop = require('node-async-loop');
const e = require('express');

var event = {

addEvent: function(request,id,callback){
    var eventDetail = {
        user_id: id,
        event_name: request.event_name,
        event_address: request.event_address,
        event_date: request.event_date,
        event_time: request.event_time,
        event_description: request.event_description,
        event_image: request.event_image,
        event_member: request.event_member,
        event_nonmember: request.event_nonmember
    }
    con.query(`INSERT INTO tbl_event SET ?`,[eventDetail], function(error,result){
        if(!error){
            var event_id = result.insertId;
            con.query(`SELECT *,CONCAT('${global.BASE_URL}','${global.EVENT_URL}',event_image) as event_image FROM tbl_event WHERE id = ?`,[event_id], function(error,result){
                if(!error){
                    callback("1","reset_keyword_add_message",result)
                }else{
                    callback("0","reset_keyword_edit_place_message",null);
                }
            })
        }else{
            callback("0","reset_keyword_something_wrong_message",null);
        }
    })
},

searchEvent: function(request,callback){
    con.query(`SELECT *,CONCAT('${global.BASE_URL}','${global.EVENT_URL}',event_image) as event_image FROM tbl_event WHERE (event_date IN ('${request.date}')) ORDER BY event_time`,function(error,result)
    {
        if(!error){
            callback("1","reset_keyword_success_message",result)
        }else{
            callback("0","reset_keyword_something_wrong_message",null);
        }
    })
},
}

module.exports = event
