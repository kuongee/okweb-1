var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require('body-parser');


var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    database: 'devdb',
    user: 'devuser',
    password: 'devpass',
    port: '3307'
});
connection.connect(); 

// 서버
var app = express();

//request 파서
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 정적인 파일 경로 public
app.use(express.static(path.join(__dirname, 'public')));

// 루트 경로 처리
//app.use('/list', require('./routes/board')); // router 빼내기
app.get('/', defaultPage);
app.get('/write', defaultPage);
app.get('/list/*', defaultPage);
app.get('/view/*', defaultPage);

function defaultPage(req, res) {
    res.sendFile(__dirname + '/public/webform11.html');
}

// 저장 
app.post('/save.json', function (req, res) {
  var message = {};
  message.name = req.param('name');
  message.email = req.param('email');
  message.message = req.param('msg');
  save(message, res);
});

// 상세보기
app.get('/view.json', function(req, res) {
  var id = req.param('id');
  view(id, res);
});

// 목록보기
app.get('/list.json', function(req, res) {
  var pageNo = req.param('pageNo');
  list(pageNo, res);
});

// 저장하기
function save(message, res) {
  var query = connection.query('INSERT INTO board SET ?', message, function (err, result) {
      var resultObj = {};
      if (err) {
          resultObj.success = false;
          console.log(err);
      } else {
          resultObj.success = true;
          resultObj.id = result.insertId;
      }
      res.send(JSON.stringify(resultObj));
  });
  console.log(query.sql);
}

// 상세보기
function view(id, res) {
  console.log(id);
  var query = connection.query('select * from board where id = ' +
                               connection.escape(id), function (err, result) {
      var resultObj = {};
      if (err) {
          resultObj.success = false;
          console.log(err);
      } else {
          res.json(result);
          return;
      }
      res.send(JSON.stringify(resultObj));
  });
  console.log(query.sql);
}

// 목록보기
function list(pageNo, res) {
  console.log(pageNo);
  var num = parseInt(pageNo) - 1;
  if (num < 0) {
      num = 0;
  }
  var query = connection.query('select * from board order by id desc limit ?, ?'
                               , [num * 3, 3]
                               , function (err, results) {
      var resultObj = {};
      if (err) {
          resultObj.success = false;
          console.log(err);
      } else {
          count(res, results);
          return;
      }
      res.send(resultObj);
  });
  console.log(query.sql);
}

// 전체 게시물 수
function count(res, list) {
  var query = connection.query('select count(*) as count from board'
                               , function (err, results) {
      var resultObj = {};
      if (err) {
          resultObj.success = false;
          console.log(err);
      } else {
          resultObj.count = results[0].count;
          resultObj.perpage = 3;
          resultObj.list = list;
          res.json(resultObj);
          return;
      }
      res.send(resultObj);
  });
}





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
