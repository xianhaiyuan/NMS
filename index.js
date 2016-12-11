var express = require('express'); 
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite');
var routes = require('./routes');
var pkg = require('./package');
var app = express();
var winston = require('winston');
var expressWinston = require('express-winston');



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	name: config.session.key,  // 设置 cookie 中保存 session id 的字段名称
	secret: config.session.secret,   // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
	cookie: {
		maxAge: config.session.maxAge // 过期时间，过期后 cookie 中的 session id 自动删除
	},
	store: new MongoStore({  // 将 session 存储到 mongodb
		url: config.mongodb
	})
}));
app.use(flash());

app.use(require('express-formidable')({
	uploadDir: path.join(__dirname, 'public/img'),
	keepExtensions: true
}));




app.locals.news = {
	title: pkg.name,
	description: pkg.description
};

app.use(function(req, res, next){
	res.locals.user = req.session.user;
	res.locals.success = req.flash('success').toString();
	res.locals.error = req.flash('error').toString();
	next();
});



// app.use(expressWinston.logger({
// 	transports: [
// 			new (winston.transports.Console)({
// 				json: true,
// 	      colorize: true
// 	  		}),
// 	  		new winston.transports.File({
// 	      filename: 'logs/success.log'
// 	    })
// 	]
// }));



routes(app);

// app.use(expressWinston.errorLogger({
//   transports: [
//     new winston.transports.Console({
//       json: true,
//       colorize: true
//     }),
//     new winston.transports.File({
//       filename: 'logs/error.log'
//     })
//   ]
// }));

app.use(function (err, req, res, next) {
  res.render('error', {
    error: err
  });
});

app.listen(config.port, function(){
	console.log(`${pkg.name} listening on port ${config.port}`);
});

//master