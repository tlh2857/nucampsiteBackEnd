var createError = require('http-errors'); // easy way to generate HTTP eror object 
var express = require('express'); // routing
var path = require('path'); // built in node modules, has mehtods to allow us to 
// construct  path to folder see line 33 - ex path.join
// all express apps use path methods 
// var cookieParser = require('cookie-parser'); //parses cookies into json data
// //cookies are stored in browser
var logger = require('morgan');  // logs api requests to console as middleware
// const session = require('express-session');
// const FileStore = require('session-file-store')(session);
// require function is retunring another function and then immediately calling this function with session
const passport = require('passport')
// const authenticate =  require('./authenticate');
const config = require('./config');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

const mongoose = require('mongoose') //provides structure for mongoDB
const url = config.mongoUrl; // standard format mongo db, with 
//host local host, and with port that MongoDB uses. /nucampsite is the name of the database
//if hosted from cloud, will need authentication key in url
const connect = mongoose.connect(url, {
  useCreateIndex: true, 
  useFindAndModify: false, 
  useNewUrlParser: true, 
  useUnifiedTopology: true
}); 

//need to use above connect for newer versions of mongoose, need to provide second object 

connect.then(()=> console.log('connected correctly to server'), 
err => console.log(err)
);  // first response once database is connected, returns promise

var app = express();


app.set('views', path.join(__dirname, 'views')); //
app.set('view engine', 'jade');

app.use(logger('dev')); // uses morgan, with dev setting when logging, dev is most detailed
app.use(express.json()); //body parser with Express, says 'parse body as json' 
app.use(express.urlencoded({ extended: false })); // have to decoded from non-URL encoding
// app.use(cookieParser('12345-67890-09876-54321'));




app.use(passport.initialize());


app.use('/', indexRouter);
app.use('/users', usersRouter);



app.use(express.static(path.join(__dirname, 'public'))); //Express.static - for images 
// this tells express to bypass the parser and bypass the middleware - dont need to process it
// just return the image file
// the public folder is everything that is not processed

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler 
// want detailed environment if development environment, if production, no error messaging neededd

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // if development environment, return err
  //if not development environment, return empty object

  // render the error page
  res.status(err.status || 500); // if there are errors, return status, if not , then status = 500
  // status 500 = Internal Server Error
  res.render('error');
});

module.exports = app;
