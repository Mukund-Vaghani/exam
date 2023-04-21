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
            required: req.language.reset_keyword_required_message,
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
            required: req.language.reset_keyword_required_message
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

router.post('/addcomment', function (req, res) {

    var id = req.user_id;
    middleware.decryption(req.body, function (request) {
        var rules = {
            user_id: '',
            post_id: 'required',
            comment_text: 'required'
        }

        var message = {
            required: req.language.reset_keyword_required_message
        }

        if (middleware.checkValidationRules(res, request, rules, message)) {
            auth.postComment(request, id, function (code, message, data) {
                middleware.send_response(req, res, code, message, data);
            })
        }
    })
})

router.post('/commentlisting', function (req, res) {
    middleware.decryption(req.body, function (request) {
        var rules = {
            post_id: 'required|numeric'
        }

        var message = {
            required: req.language.reset_keyword_required_message
        }

        if (middleware.checkValidationRules(res, request, rules, message)) {
            auth.commentList(request, function (code, message, data) {
                middleware.send_response(req, res, code, message, data);
            })
        }
    })
})

// ************************************ FAQ ****************************************

router.post('/faq', function (req, res) {
    middleware.decryption(req.body, function (request) {
        auth.faq(request, function (code, message, data) {
            middleware.send_response(req, res, code, message, data);
        })
    })
})


// ********************************** multer *****************************************
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../exam/public/post')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

var post = multer({
    storage: storage,
    limits: {
        fileSize: (12 * 1024 * 1024)
    }
}).single('post');


router.post('/uploadpostpicture', function (req, res) {
    post(req, res, function (error) {
        if (error) {
            console.log(error);
            middleware.send_response(req, res, "0", "fail to upload post", null);
        } else {
            middleware.send_response(req, res, "1", "upload success", { image: req.file.filename });
        }
    })
})

module.exports = router;
