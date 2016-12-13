var express = require('express');
var router = express.Router();
var PostModel = require('../models/news');
var CommentModel = require('../models/comments');
var checkLogin = require('../middlewares/check').checkLogin;
var path = require('path');
router.get('/', function(req, res, next){// GET /news 所有用户或者特定用户的新闻页
	var author_id = req.query.author_id;
	//此处可以跳转到某个用户的文章
	PostModel.getNewses(author_id)
	.then(function(newses){
		res.render('news', {
			newses: newses
		});
	})
	.catch(next);
});
router.post('/', checkLogin, function(req, res, next){ // POST /news 发表一篇新闻
	var author_id = req.session.user._id;
	var author = req.session.user.name;
	var title = req.fields.title;
	var content = req.fields.content;
	var categories = req.fields.categories;
	var post_time = new Date();
	var news_pic = req.files.news_pic.path.split(path.sep).pop();
	var publish_house = req.fields.publish_house;
	try{
		if(!title.length){
			throw new Error('请填写标题');
		}
		if(!content.length){
			throw new Error('请填写新闻内容');
		}
	}catch(e){
		req.flash('error', e.message);
		return res.redirect('back');
	}

	var news = {
		author_id: author_id,
		author: author,
		title: title,
		content: content,
		permission: 'n',
		post_time: post_time,
		categories: categories,
		pv: 0,
		weight: 0,
		news_pic: news_pic,
		publish_house: publish_house
	};

	PostModel.create(news)
	.then(function(result){
		news = result.ops[0];
		req.flash('success', '发表成功');
		res.redirect(`/news/${news._id}`);
	})
	.catch(next);
});

router.get('/create', checkLogin, function(req, res, next){ // GET /news 所有用户或者特定用户的新闻页
	res.render('create');
});
router.get('/:newsID', function(req, res, next){ // GET /news/:postId 单独一篇的新闻页
	var newsID = req.params.newsID;
	Promise.all([
			PostModel.getNewsById(newsID),
			CommentModel.getComments(newsID),
			PostModel.incPv(newsID)
		])
	.then(function(result){
		var news = result[0];
		var comments = result[1];
		if (!news) {
			throw new Error('改文章不存在');
		}
		res.render('single-news', {
			news: news,
			comments: comments
		});
	})
	.catch(next);
});
router.get('/:newsID/edit', checkLogin, function(req, res, next){ // GET /news/:postId/edit 更新新闻页
	var newsID = req.params.newsID;
	var author_id = req.session.user._id;

	PostModel.getRawNewsById(newsID)
	.then(function(news){
		if (!news) {
			throw new Error('该新闻不存在');
		}
		if (author_id.toString() !== news.author_id._id.toString()){
			throw new Error('权限不足');
		}
		res.render('edit', {
			news: news
		});
	})
	.catch(next);

});
router.post('/:newsID/edit', checkLogin, function(req, res, next){ // POST /news/:postId/edit 更新一篇新闻
	var newsID = req.params.newsID;
	var author_id = req.session.user._id;
	var title = req.fields.title;
	var content = req.fields.content;

	PostModel.updateNewsById(newsID, author_id, {title: title, content: content})
		.then(function(){
			req.flash('success', '编辑新闻成功');
			res.redirect(`/news/${newsID}`);
		})
		.catch(next);
});
router.get('/:newsID/remove', checkLogin, function(req, res, next){ // GET /news/:postId/remove 删除一篇新闻
	var newsID = req.params.newsID;
	var author_id = req.session.user._id;

	PostModel.delNewsById(newsID, author_id)
		.then(function(){
			req.flash('success', '文章删除成功');
			res.redirect('/news');
		})
		.catch(next);
});
router.post('/:newsID/comment', checkLogin, function(req, res, next){ // POST /news/:postId/comment 创建一条留言
	var author_id = req.session.user._id;
	var newsID = req.params.newsID;
	var content = req.fields.content;
	var comment = {
		author_id: author_id,
		newsId: newsID,
		content: content
	};
	CommentModel.create(comment).then(function(){
		req.flash('success', '留言成功');
		res.redirect('back');
	})
	.catch(next);
});
router.get('/:newsID/comment/:commentID/remove', checkLogin, function(req, res, next){ // GET /news/:postId/comment/:commentId/remove 删除一条留言
	var commentId = req.params.commentId;
	var author_id = req.session.user._id;
	CommentModel.delCommentById(commentId, author_id).then(function(){
		req.flash('success', '删除留言成功');
		res.redirect('back');
	})
	.catch(next);
});
module.exports = router;