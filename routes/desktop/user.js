var express = require('express');
var router = express.Router();
var path = require('path');
var checkLogin = require('../../middlewares/desk-check').checkLogin;
var UserModel = require('../../models/users');

router.get('/', checkLogin function(req, res, next){
	res.render('desktop/user');
});
router.get('/news', checkLogin, function(req, res, next){
	res.render('desktop/user_news');
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