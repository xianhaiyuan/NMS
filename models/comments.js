var marked = require('marked');
var Comment = require('../db/mongo').Comment;
var moment = require('./tool/moment_zh');
Comment.plugin('contentToHtml', {
	afterFind: function(comments){
		return comments.map(function(comment){
			comment.content = marked(comment.content);
			return comment;
		});
	}
});

Comment.plugin('addFromNow', {
	afterFind: function(comments){
		return comments.map(function(comment){
			moment.locale('zh-ch');
			var now = moment();
			comment.fromNow = moment(comment.created_at).from(now);
			return comment;
		});
	}
});

module.exports = {
	create: function create(comment){
		return Comment.create(comment).exec();
	},
	delCommentById: function delCommentById(commentId, author_id){
		return Comment.remove({author_id: author_id, _id: commentId}).exec();
	},
	getComments: function getComments(newsId){
		return Comment
			.find({newsId: newsId})
			.populate({path: 'author_id', model: 'User'})
			.sort({_id: -1})
			.addCreatedAt()
			.addFromNow()
			.contentToHtml()
			.exec();
	},
	getCommentsCount: function getCommentsCount(newsId){
		return Comment.count({newsId: newsId}).exec();
	}

};