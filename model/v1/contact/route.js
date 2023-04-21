var express = require('express');
var router = express.Router();
var middleware = require('../../../middleware/validation');
var auth = require('./contact');
var multer = require('multer');
var path = require('path');

router.post('/contactus', function(req,res){
    var id = req.user_id;
    middleware.decryption(req.body, function(request){
        var rules = {
            title: 'required',
            email: 'required|email',
            message: 'required'
        }

        var message = {
            required: req.language.reset_keyword_required_message,
            email: req.language.reset_keyword_invalid_email_message
        }

        if (middleware.checkValidationRules(res, request, rules, message)) {
            auth.contactUs(request,id, function (code, message, data) {
                middleware.send_response(req, res, code, message, data);
            })
        }
    })
})


var contactstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/contact');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

var uploadcontact = multer({
    storage: contactstorage,
    limits: {
        fileSize: (12 * 1024 * 1024)
    }
})

var uploadmultiimage = uploadcontact.fields([
    {
        name: 'contact_image',
        maxCount: 3
    }
]);

router.post('/uploadcontactimage', function (req, res) {
    uploadmultiimage(req, res, function (error) {
        if (error) {
            console.log(error)
            middleware.send_response(req, res, "0", "fail to upload image", null);
        } else {
            var image = [];
        req.files.contact_image.forEach(element => {
            image.push(element);
        });
        
        middleware.send_response(req, res, "1", "upload success", { image: image });
            // middleware.send_response(req, res, "1", "upload success", { image: req.files.contact_image[0].filename });
        }
    })
})


module.exports = router;