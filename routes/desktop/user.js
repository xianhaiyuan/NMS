var express = require('express');
var router = express.Router();
var path = require('path');
var checkLogin = require('../../middlewares/desk-check').checkLogin;
var UserModel = require('../../models/users');
var PostModel = require('../../models/news');

router.get('/', checkLogin, function(req, res, next){
	res.render('desktop/user');
});
router.get('/news/:author_id', checkLogin, function(req, res, next){
	var author_id = req.params.author_id;
	PostModel.getNewsByAuthorId(author_id)
	.then(function(result){
		res.render('desktop/user-news',{
			newses: result
		});
	});
});
router.post('/news', checkLogin, function(req, res, next){
	var news_id = req.fields.news_id;
	var author_id = req.session.user._id;
	PostModel.delNewsByAuthorId(news_id, author_id)
	.then(function(result){
		res.send('success');
	})
});
router.get('/admin', checkLogin, function(req, res, next){
	var user = req.session.user;
	if (user.privilege === 'admin') {
		PostModel.getAllNews()
		.then(function(result){
			res.render('desktop/admin',{
				newses: result
			});
		})
	}else{
		res.render('desktop/404',{
		});
	}
	
})
router.post('/admin/:action', checkLogin, function(req, res, next){
	var user = req.session.user;
	if (user.privilege === 'admin') {
		var action = req.params.action;
		var news_id = req.fields.news_id;
		var weight = req.fields.weight;
		weight = parseInt(weight, 10);
		if (action === 'permit') {
			PostModel.updateW_permit(news_id, weight)
			.then(function(result){
				res.send('success');
			});
		}
		if (action === 'discard') {
			console.log("discard")
			PostModel.delNewsByNewsId(news_id)
			.then(function(result){
				res.send('success');
			})
			res.send('success');
		}
	}else{
		es.render('desktop/404',{
		});
	}
	
})
router.post('/', checkLogin, function(req, res, next){
	var _id = req.session.user._id;
	var name = req.fields.name;
	var resume = req.fields.resume;
	var avatar = 
	/(\.jpg)/.test(req.files.avatar.path.split(path.sep).pop()) ? req.files.avatar.path.split(path.sep).pop() : req.session.user.avatar;
	var user = {
		"_id": _id,
		"name": name,
		"resume": resume,
		"avatar": avatar
	};
	UserModel.update(user)
	.then(function(result){
		req.session.user.name = name;
		req.session.user.resume = resume;
		req.session.user.avatar = avatar;
		res.redirect('/user');
	});
});


module.exports = router;