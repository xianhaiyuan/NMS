var News = require('../db/mongo').News;
var marked = require('marked');
var CommentModel = require('./comments');

News.plugin('addCommentsCount', {
	afterFind: function(newses){
		return Promise.all(newses.map(function(news){
			return CommentModel.getCommentsCount(news._id).then(function(commentsCount){
				news.commentsCount = commentsCount;
				return news;
			});
		}));
	},
	afterFindOne: function(news){
		if (news) {
			return CommentModel.getCommentsCount(news._id).then(function(commentsCount){
				news.commentsCount = commentsCount;
				return news;
			});
		}
		return news;
	}
});

News.plugin('contentToHtml',{
	afterFind: function(newses){
		return newses.map(function(news){
			news.content = marked(news.content);
			return news;
		});
	},
	afterFindOne: function(news){
		if (news) {
			news.content = marked(news.content);
		}
		return news;
	}
});

module.exports = {
	create: function(news){
		return News.create(news).exec();
	},
	getAllNews: function getAllNews(){
		return News
		.find({})
		.populate({path: 'author_id', model: 'User'})
		.addCreatedAt()
		.addCommentsCount()
		.contentToHtml()
		.exec();;
	},
	getNewsById: function getNewsById(newsid){
		return News
		.findOne({_id: newsid})
		.populate({path: 'author_id', model: 'User'})
		.addCreatedAt()
		.addCommentsCount()
		.contentToHtml()
		.exec();
	},
	getNewsByAuthorId: function getNewsByAuthorId(author_id){
		return News
		.find({author_id: author_id})
		.populate({path: 'author_id', model: 'User'})
		.addCreatedAt()
		.addCommentsCount()
		.contentToHtml()
		.exec();
	},
	getNewses: function getNewses(){
		var query = {};
		query.permission = 'y';
		return News
		.find(query)
		.populate({path: 'author_id', model: 'User'})
		.sort({_id: -1})
		.addCreatedAt()
		.addCommentsCount()
		.contentToHtml()
		.exec();
	},
	getNewsByCategories: function getNewsByCategories(categories){
		var query = {};
		query.categories = categories;
		query.permission = 'y';
		return News
		.find(query)
		.populate({path: 'author_id', model: 'User'})
		.sort({_id: -1})
		.addCreatedAt()
		.contentToHtml()
		.exec();
	},
	getNewses_limit_8: function getNewses_limit_8(author_id){
		var query = {};
		if (author_id) {
			query.author_id = author_id;
		}
		query.permission = 'y';
		return News
		.find(query)
		.limit(8)
		.populate({path: 'author_id', model: 'User'})
		.sort({_id: -1})
		.addCreatedAt()
		.addCommentsCount()
		.contentToHtml()
		.exec();
	},
	getNewsByType_w0_limit8: function getNewsByType_w0(categories){
		var query = {
		};
		query.categories = categories;
		query.weight = 0;
		query.permission = 'y';
		return News
		.find(query)
		.limit(8)
		.populate({path: 'author_id', model: 'User'})
		.sort({_id: -1})
		.addCreatedAt()
		.contentToHtml()
		.exec();
	},
	getNewsByType_w1_limit8: function getNewsByType_w1(categories){
		var query = {};
		query.categories = categories;
		query.weight = 1;
		query.permission = 'y';
		return News
		.find(query)
		.limit(8)
		.populate({path: 'author_id', model: 'User'})
		.sort({_id: -1})
		.addCreatedAt()
		.contentToHtml()
		.exec();
	},
	incPv: function incPv(newsid){
		return News
		.update({_id: newsid}, {$inc: {pv: 1}})
		.exec();
	},
	getRawNewsById: function getRawNewsById(newsid){
		return News
		.findOne({_id: newsid})
		.populate({path: 'author_id', model: 'User'})
		.exec();
	},
	updateNewsById: function updateNewsById(newsid, author_id, data){
		return News.update({author_id: author_id, _id: newsid}, {$set: data}).exec();
	},
	delNewsById: function delNewsById(newsid, author_id){
		return News.remove({author_id: author_id, _id: newsid}).exec();
	}
};