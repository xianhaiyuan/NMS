module.exports = function(app){
	
	app.get('/', function(req, res){
		res.redirect('/news');
	});
	app.use('/isignup', require('./mobile/isignup'));
	app.use('/isignin', require('./mobile/isignin'));
	app.use('/isignout', require('./mobile/isignout'));
	app.use('/inews', require('./mobile/inews'));

	app.use('/news', require('./desktop/news'));
	app.use('/signup', require('./desktop/signup'));
	app.use('/user', require('./desktop/user'));
	

	app.use(function (req, res) {
    if (!res.headersSent) {
      res.render('mobile/i404');
    }
  });
};

