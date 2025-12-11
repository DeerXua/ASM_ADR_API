var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//thêm đây moodule mongoose
const mongoose= require("mongoose");
require("./models/categories");
require("./models/accounts");
require("./models/bills");
require("./models/products");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const accountRouter = require('./routes/accountRouter');
const productRouter = require('./routes/productRouter');
const billRouter = require('./routes/billRouter');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/accounts', accountRouter);
app.use('/products', productRouter);
app.use('/bills', billRouter);
//connect mongoose
mongoose.connect('mongodb+srv://deerxua:deerxua@cluster0.shccjuy.mongodb.net/ASM2')
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
