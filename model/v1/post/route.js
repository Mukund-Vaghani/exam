var express = require('express');
var router = express.Router();
var middleware = require('../../../middleware/validation');
var auth = require('./post');
var multer = require('multer');
var path = require('path');


router.post('/addpost', function (req, res) {
    // var request = req.body;
    var id = req.user_id;
    middleware.decryption(req.body, function (request) {
        var rules = {
            image: 'required',
            description: 'required'
        }

        var message = {
            require: req.language.reset_keyword_required_message,
            email: req.language.reset_keyword_invalid_email_message
        }

        if (middleware.checkValidationRules(res, request, rules, message)) {
            auth.addpost(request, id, function (code, message, data) {
                middleware.send_response(req, res, code, message, data);
            })
        }
    })
})

router.post('/homescreen', function (req, res) {

    middleware.decryption(req.body, function (request) {
    var rules = {
        search: '',
    }

    var message = {
        require: req.language.reset_keyword_required_message
    }

        if (middleware.checkValidationRules(res, request, rules, message)) {
            auth.homePage(request, function (code, message, data) {
                middleware.send_response(req, res, code, message, data);
            })
        }
    })
})

router.get('/myprofile', function (req, res) {
    var id = req.user_id;
    middleware.decryption(req.body, function (request) {
        auth.getUser(id, function (code, message, data) {
            middleware.send_response(req, res, code, message, data);
        })
    })
})

router.get('/mypost', function (req, res) {
    var id = req.user_id;
    middleware.decryption(req.body, function (request) {
        auth.getPost(id, function (code, message, data) {
            middleware.send_response(req, res, code, message, data);
        })
    })
})

router.post('/addcomment', function(req,res){

    var id = req.user_id;
    middleware.decryption(req.body, function (request) {
        var rules = {
            user_id: '',
            post_id: 'required',
            comment_text: 'required'
        }
    
        var message = {
            require: req.language.reset_keyword_required_message
        }
    
            if (middleware.checkValidationRules(res, request, rules, message)) {
                auth.postComment(request,id, function (code, message, data) {
                    middleware.send_response(req, res, code, message, data);
                })
            }
        })
})

module.exports = router;
