const common = require('../../../config/common');
var con = require('../../../config/database');
var global = require('../../../config/constant');
var middleware = require('../../../middleware/validation');
var asyncLoop = require('node-async-loop');
const e = require('express');

var post = {

    addpost: function (request, id, callback) {
        var postDetail = {
            user_id: id,
            image: request.image,
            description: request.description
        }
        con.query(`INSERT INTO tbl_post SET ?`, [postDetail], function (error, result) {
            if (!error) {
                var post_id = result.insertId;
                post.getPostDetail(post_id, function (post_data) {
                    if (post_data) {
                        callback("1", "success", post_data);
                    } else {
                        callback("0", "something went wrong", null);
                    }
                })
            } else {
                callback("0", "something went wrong", null)
            }
        })
    },

    homePage: function (request, callback) {

        if (request.search != undefined) {
            var condition = `where u.name like '%${request.search}%'`;
        } else {
            var condition = `WHERE p.is_active = 1 AND p.is_delete = 0 ORDER BY id DESC`;
        }

        var sql = `SELECT p.*,CASE 
        WHEN TIMESTAMPDIFF(SECOND, p.active_at, NOW())<60 THEN CONCAT(TIMESTAMPDIFF(MINUTE,p.active_at,NOW()),' ','second ago')
        WHEN TIMESTAMPDIFF(MINUTE, p.active_at, NOW())<60 THEN CONCAT(TIMESTAMPDIFF(MINUTE,p.active_at,NOW()),' ','minutes ago')
        WHEN TIMESTAMPDIFF(HOUR,p.active_at,NOW())<24 THEN  CONCAT(TIMESTAMPDIFF(HOUR,p.active_at,NOW()),' ','hours ago')
        WHEN TIMESTAMPDIFF(DAY,p.active_at,NOW())<31 THEN CONCAT(TIMESTAMPDIFF(DAY,p.active_at,NOW()),' ','days ago')
        ELSE DATE_FORMAT(DATE(p.active_at), "%d %M, %Y")
        END AS post_time,CONCAT('${global.BASE_URL}','${global.POST_URL}',image) as post_image,u.name FROM tbl_post p join tbl_user u on p.user_id = u.id `;
        sql += condition;

        con.query(sql, function (error, result) {
            if (!error && result.length > 0) {
                callback("1", "reset_keyword_success_message", result);
            } else {
                console.log(error);
                callback("0", "reset_keyword_something_wrong_message", null);
            }
        })
    },

    getPostDetail: function (post_id, callback) {
        con.query(`SELECT *,CONCAT('${global.BASE_URL}','${global.POST_URL}', image) as post FROM tbl_post WHERE id = ?`, [post_id], function (error, result) {
            if (!error && result.length > 0) {
                callback(result);
            } else {
                callback(null);
            }
        })
    },

    getUser: function(id,callback){
        con.query(`SELECT u.*,CONCAT('${global.BASE_URL}','${global.USER_URL}', u.user_profile) as profile,ud.token,ud.device_type,device_token FROM tbl_user u join tbl_user_deviceinfo ud on u.id = ud.user_id WHERE u.id = ${id}`,function(error,result){
            if(!error){
                callback("1","reset_keyword_success_message",result)
            }else{
                callback("0","reset_keyword_something_wrong_message",null);
            }
        })
    },

    getPost: function(id,callback){
        con.query(`SELECT *,CONCAT('${global.BASE_URL}','${global.POST_URL}', image) as post_image FROM tbl_post WHERE user_id = ${id}`, function(error,result){
            if(!error){
                callback("1","reset_keyword_success_message",result);
            }else{
                callback("0","reset_keyword_something_wrong_message",null);
            }
        })
    },

    postComment: function(request,id,callback){
        var commentDetail = {
            user_id: id,
            post_id: request.post_id,
            comment_text: request.comment_text
        }
        con.query(`INSERT INTO tbl_comments SET ?`,[commentDetail],function(error,result){
            if(!error){
                var id = result.insertId;
                con.query(`SELECT * FROM tbl_comments WHERE id = ${id}`,function(error,result){
                    if(!error){
                        callback("1","reset_keyword_success_message",result);
                    }else{
                        callback("0","reset_keyword_edit_place_message",null);
                    }
                })
            }else{
                callback("0","reset_keyword_something_wrong_message",null);
            }
        })
    },

    commentList: function(request,callback){
        con.query(`SELECT p.total_comment,u.name,CONCAT('${global.BASE_URL}','${global.USER_URL}',u.user_profile) as user_profile FROM tbl_post p join tbl_user u on p.user_id = u.id WHERE p.id = ?`,[request.post_id], function(error,result){
            if(!error){
                con.query(`SELECT c.*,CONCAT('${global.BASE_URL}','${global.USER_URL}',u.user_profile) as user_profile FROM tbl_comments c join tbl_user u ON c.user_id = u.id WHERE c.post_id = ?`,[request.post_id], function(error,comment){
                    if(!error){
                        result[0].comment = comment;
                        callback("1","reset_keyword_success_message",result)
                    }else{
                        console.log(error)
                        callback("0","reset_keyword_something_wrong_message",null);
                    }
                })
            }else{
                console.log(error);
                callback("0","reset_keyword_something_wrong_message",null)
            }
        })
    },


// ********************************* FAQ *************************************************

    faq: function(request,callback){
        if (request.search != undefined) {
            var condition = `where question like '%${request.search}%'`;
        } else {
            var condition = `WHERE is_active = 1 AND is_delete = 0`;
        }

        var sql = `SELECT * FROM tbl_faq `;
        sql += condition;

        con.query(sql, function (error, result) {
            if (!error && result.length > 0) {
                callback("1", "reset_keyword_success_message", result);
            } else {
                console.log(error);
                callback("0", "reset_keyword_something_wrong_message", null);
            }
        })
    },
}

module.exports = post