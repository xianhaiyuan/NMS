var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var UserModel = require('../../models/users');
var checkNotLogin = require('../../middlewares/desk-check').checkNotLogin;
router.get('/' ,checkNotLogin, function(req, res, next){
	res.render('desktop/signup');
});
router.post('/' ,checkNotLogin, function(req, res, next){
	var name = req.fields.name;
	var gender = req.fields.gender;
	var resume = req.fields.resume;
	console.log(name);
	var avatar = req.files.avatar.path.split(path.sep).pop();
	var username = req.fields.username;
	var password = req.fields.password;
	var repassword = req.fields.repassword;
	var privilege = 'user';

	try{
		if (!(username.length >= 1 && username.length <=10)){
			throw new Error('用户名请限制在 1-10 个字符。');
		}
		if (!(name.length >= 1 && name.length <=10)){
			throw new Error('姓名请限制在 1-10 个字符。');
		}
		if(['m', 'f', 'x'].indexOf(gender) === -1){
			throw new Error('性别只能是m,f或x');
		}
		if(!(resume.length >= 1 && resume.length <=30)){
			throw new Error('个人简介请限制在 1-30 个字符');
		}
		if (!req.files.avatar.name) {
    		throw new Error('缺少头像');
   		}
   		if (password.length < 3) {
      		throw new Error('密码至少 3 个字符');
    	}
    	if (password !== repassword) {
     		throw new Error('两次输入密码不一致');
   		}
	}catch (e) {
		req.flash('error', e.message);
		console.log(e.message);
		return res.redirect('/isignup');
	}

	password = sha1(password);

	var user = {
		name: name,
		username: username,
		password: password,
		gender: gender,
		resume: resume,
		avatar: avatar,
		privilege: privilege
	};

	UserModel.create(user)
	.then(function(result){
		user = result.ops[0];
		delete user.password;
		req.session.user = user;
		req.flash('success', '注册成功');
		res.redirect('/news');
	})
	.catch(function(e){
		if (e.message.match('E11000 duplicate key')) {
			req.flash('error', '用户名已存在');
			return res.redirect('/signup');
		}
		next(e);
	});
});
module.exports = router;

