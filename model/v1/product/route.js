var express = require('express');
var router = express.Router();
var middleware = require('../../../middleware/validation');
var product = require('./product');
var multer = require('multer');
var path = require('path');
const message = require('../../../language/en');


router.post('/addtocart', function (req, res) {
    middleware.decryption(req.body, function (request) {
        request.user_id = req.user_id;
        var rules = {
            product_id: "required",
            sub_total: "required",
            unit: "required",
            price: "required"
        };
        var messages = {
            required: req.language.required
        }
        if (middleware.checkValidationRules(res, request, rules, messages)) {
            product.addToCart(request, function (code, message, data) {
                middleware.send_response(res, req, code, message, data);
            });
        };
    });
});

router.post('/place_order', function(req,res){
    var id = req.user_id;
    middleware.decryption(req.body, function(request){
        product.placeOrder(request,id, function(code,message,data){
            middleware.send_response(res,req,code,message,data)
        })
    })
})

router.post('/confirm_order', function (req, res) {

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
