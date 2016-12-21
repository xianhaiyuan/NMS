var express = require('express');
var router = express.Router();
var sha1 = require('sha1');


var userModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;
router.get('/' ,checkNotLogin, function(req, res, next){
	res.render('mobile/isignin');
});
router.post('/' , checkNotLogin, function(req, res, next){
	var username = req.fields.username;
	var password = req.fields.password;
	userModel.getUserByName(username)
	.then(function(user){
		if (password === ""){
			return res.send({err: '请输入密码!'});
		}
		if (user[0] === undefined) {
			// req.flash('error', '用户不存在');
			// return res.redirect('back');
			return res.send({err: '用户不存在!'});
		}
		if (sha1(password) !== user[0].password) {
			// req.flash('error', '用户名或密码错误');
			// return res.redirect('back');
			return res.send({err: '用户名或密码错误!'});
		}
		req.flash('success', '登录成功');
		delete user[0].password;
		req.session.user = user[0];
		res.send({success: 'success'});
	})
	.catch(next);

	
	


});
module.exports = router;
