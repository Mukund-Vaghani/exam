require('dotenv').config();
const express = require('express');
var app = express();

app.use(express.text());
app.use(express.urlencoded({ extended: false }));

// app.use('/v1/api_document/',require('./model/v1/api_document/index'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


var auth = require('./model/v1/auth/route');
var post = require('./model/v1/post/route');
var event = require('./model/v1/event/route');
var contact = require('./model/v1/contact/route')

app.use('/', require('./middleware/validation').extractheaderlanguage)
app.use('/', require('./middleware/validation').validateApiKey);
app.use('/', require('./middleware/validation').validateUserToken);

app.use('/api/v1/auth', auth);
app.use('/api/v1/post', post);
app.use('/api/v1/event',event);
app.use('/api/v1/contact',contact);

try {
    app.listen(process.env.PORT);
    console.log('app listing on port : 8192');
} catch {
    console.log('connection fails');
}