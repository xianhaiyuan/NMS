module.exports = function(app){
	
	app.get('/', function(req, res){
		res.redirect('/inews');
	});
	app.use('/isignup', require('./isignup'));
	app.use('/isignin', require('./isignin'));
	app.use('/isignout', require('./isignout'));
	app.use('/inews', require('./inews'));
	

	app.use(function (req, res) {
    if (!res.headersSent) {
      res.render('mobile/i404');
    }
  });
};

