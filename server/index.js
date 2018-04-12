const express = require('express');
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log('===> mongodb connected');
});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// To prevent errors from Cross Origin Resource Sharing, we will set
// our headers to allow CORS with middleware like so:
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  // and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});


// serve static files from template
// app.use(express.static(__dirname + '/templateLogReg'));

// include routes
var routes = require('./routes/router');
app.use('/api', routes);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error('File Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
// define as the last app.use callback
// app.use(function (err, req, res, next) {
//   res.status(err.status || 500);
//   res.send(err.message);
// });

// Webpack middleware
// const webpack = require("webpack");
// const webpackMiddleware = require("webpack-dev-middleware");
// const webpackHotMiddleware = require("webpack-hot-middleware");
// const webpackConfig = require("../webpack.config.js");
// const compiler = webpack(webpackConfig);

// app.use(webpackMiddleware(compiler, {
//     hot: true,
//     publicPath: webpackConfig.output.publicPath,
//     noInfo: true
// }));
// app.use(webpackHotMiddleware(compiler));

// Routes
// app.get("/*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../static/index.html"));
// });

var port = 3000;
// Listen
app.listen(port, (error) => {
    if (error) { console.error(error); }
    else { console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port); }
});
