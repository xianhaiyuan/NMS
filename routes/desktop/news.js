var express = require('express');
var router = express.Router();
var PostModel = require('../../models/news');
var CommentModel = require('../../models/comments');
var checkLogin = require('../../middlewares/desk-check').checkLogin;
var checkLogin_Ajax = require('../../middlewares/desk-check').checkLogin_Ajax;
var path = require('path');
var moment = require('moment');

router.get('/', function(req, res, next){// GET /news 所有用户或者特定用户的新闻页
	// var author_id = req.query.author_id;
	//此处可以跳转到某个用户的文章
	Promise.all([
			PostModel.getNewses(),
			PostModel.getNewsByType_w_n_limit_n('top-stories', 0, 5),
			PostModel.getNewsByType_w_n_limit_n('top-stories', 1, 4),
			PostModel.getNewsByType_w_n_limit_n('sport', 0, 5),
			PostModel.getNewsByType_w_n_limit_n('sport', 1, 4)
		])
	.then(function(result){
			var newses = result[0];
			var top_stories_w0 = result[1];
			var top_stories_w1 = result[2];
			var sport_newses_w0 = result[3];
			var sport_newses_w1 = result[4];
			res.render('desktop/news', {
			newses: newses,
			top_stories_w0: top_stories_w0,
			top_stories_w1: top_stories_w1,
			sport_newses_w0: sport_newses_w0,
			sport_newses_w1: sport_newses_w1
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
	var except = req.fields.except;
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
		publish_house: publish_house,
		except: except
	};

	PostModel.create(news)
	.then(function(result){
		news = result.ops[0];
		req.flash('success', '发表成功');
		res.redirect(`/news/create`);
	})
	.catch(next);
});

router.get('/create', checkLogin, function(req, res, next){ // GET /news 所有用户或者特定用户的新闻页
	res.render('desktop/create');
});
router.get('/cate/:newsCategories', function(req, res, next){
	var categories = req.params.newsCategories;
	Promise.all([
			PostModel.getNewsByCategories(categories),
			PostModel.getNewsByType_w_n_limit_n(categories, 1, 8),
			PostModel.getNewses(),
		])
		.then(function(result){
			res.render('mobile/icate-news', {
				newses_cate_all: result[0],
				newses_w1: result[1],
				newses: result[2]
			});
		})
		.catch(next);
})
router.get('/:newsID', function(req, res, next){ // GET /news/:postId 单独一篇的新闻页
	var newsID = req.params.newsID;
	Promise.all([
			PostModel.getNewsById(newsID),
			CommentModel.getComments(newsID),
			PostModel.getNewsByType_w_n_limit_n('top-stories', 0, 8),
			PostModel.incPv(newsID),
			PostModel.getNewses()
		])
	.then(function(result){
		var news = result[0];
		var comments = result[1];
		var top_stories = result[2];
		var newses = result[4];
		if (!news) {
			throw new Error('改文章不存在');
		}
		news.post_time = moment(news.post_time).format('YYYY-MM-DD HH:mm');
		res.render('desktop/single-news', {
			top_stories: top_stories,
			news: news,
			comments: comments,
			newses: newses
		});
	})
	.catch(next);
});
router.get('/:newsID/iedit', checkLogin, function(req, res, next){ // GET /news/:postId/edit 更新新闻页
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
		res.render('mobile/iedit', {
			news: news
		});
	})
	.catch(next);

});
router.post('/:newsID/iedit', checkLogin, function(req, res, next){ // POST /news/:postId/edit 更新一篇新闻
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
router.get('/:newsID/iremove', checkLogin, function(req, res, next){ // GET /news/:postId/remove 删除一篇新闻
	var newsID = req.params.newsID;
	var author_id = req.session.user._id;

	PostModel.delNewsById(newsID, author_id)
		.then(function(){
			req.flash('success', '文章删除成功');
			res.redirect('/news');
		})
		.catch(next);
});
router.get('/:newsID/icomment', function(req, res, next){
	var newsID = req.params.newsID;
	CommentModel.getComments(newsID)
		.then(function(comments){
			res.render('mobile/icomment',{
				comments: comments
			});
		})
		.catch(next);
});

router.post('/:newsID/comment', checkLogin_Ajax, function(req, res, next){ // POST /news/:postId/comment 创建一条留言
	var author_id = req.session.user._id;
	var newsID = req.params.newsID;
	var content = req.fields.content;
	var comment = {
		author_id: author_id,
		newsId: newsID,
		content: content
	};
	CommentModel.create(comment).then(function(){
		// req.flash('success', '留言成功');
		res.redirect('back');
	})
	.catch(next);
});

router.get('/:newsID/icomment/:commentID/iremove', checkLogin, function(req, res, next){ // GET /news/:postId/comment/:commentId/remove 删除一条留言
	var commentId = req.params.commentId;
	var author_id = req.session.user._id;
	CommentModel.delCommentById(commentId, author_id).then(function(){
		req.flash('success', '删除留言成功');
		res.redirect('back');
	})
	.catch(next);
});
module.exports = router;