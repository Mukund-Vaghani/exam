var express = require('express');
var router = express.Router();
var middleware = require('../../../middleware/validation');
var auth = require('./event');
var multer = require('multer');
var path = require('path');


router.post('/addevent', function (req, res) {
    var id = req.user_id;
    middleware.decryption(req.body, function (request) {
        var rules = {
            event_name: 'required',
            event_address: 'required',
            event_date: 'required',
            event_time: 'required',
            event_description: 'required',
            event_image: 'required',
            event_member: 'required',
            event_nonmember: 'required'
        }

        var message = {
            required: req.language.reset_keyword_required_message
        }

        if (middleware.checkValidationRules(res, request, rules, message)) {
            auth.addEvent(request, id, function (code, message, data) {
                middleware.send_response(req, res, code, message, data);
            })
        }
    })
})

router.post('/eventsearch', function (req, res) {
    middleware.decryption(req.body, function (request) {
        var rules = {
            date: 'required|date',
        }

        var message = {
            required: req.language.reset_keyword_required_message
        }

        if (middleware.checkValidationRules(res, request, rules, message)) {
            auth.searchEvent(request, function (code, message, data) {
                middleware.send_response(req, res, code, message, data);
            })
        }
    })
})


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../exam/public/event')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

var event = multer({
    storage: storage,
    limits: {
        fileSize: (12 * 1024 * 1024)
    }
}).single('event');

router.post('/uploadeventpicture', function (req, res) {
    event(req, res, function (error) {
        if (error) {
            console.log(error);
            middleware.send_response(req, res, "0", "fail to upload event image", null);
        } else {
            middleware.send_response(req, res, "1", "upload success", { image: req.file.filename });
        }
    })
})

module.exports = router;
