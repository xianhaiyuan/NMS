module.exports = {
	checkLogin: function(req, res, next){
		if(!req.session.user){
			req.flash('error', '未登陆');
			return res.redirect('/');
		}
		next();
	},
	checkNotLogin: function(req, res, next){
		if(req.session.user){
			req.flash('error', '已登陆');
			return res.redirect('back'); //返回之前页面
		}
		next();
	},
	checkLogin_Ajax: function(req, res, next){
		if(!req.session.user){
			req.flash('error', '未登陆');
			return res.send('/');
		}
		next();
	},
	checkNotLogin_Ajax: function(req, res, next){
		if(req.session.user){
			req.flash('error', '已登陆');
			return res.send('back'); //返回之前页面
		}
		next();
	}
};
