var config = require('config-lite');
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

mongolass.plugin('addCreatedAt', {
	afterFind: function(results){
		results.forEach(function(item){
			item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
		});
		return results;
	},
	afterFindOne: function(result){
		result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
		return result;
	}
});

exports.User = mongolass.model('User',{
	name: {type: 'string'},
	username: {type: 'string'},
	password: {type: 'string'},
	avatar: {type: 'string'},
	gender: {type: 'string', enum: ['m', 'f', 'x']},
	resume: {type: 'string'},
	privilege: {type: 'string', enum: ['user', 'admin']}
});
exports.User.index({username: 1}, {unique: true}).exec();

exports.News = mongolass.model('News', {
	author_id: {type: Mongolass.Types.ObjectId},
	author: {type: 'string'},
	categories: {type: 'string', enum: ['top-stories', 'polity', 'sport', 'entertain', 'financial', 'fashion', 'cars', 'h-property', 'technology', 'games']},
	permission: {type: 'string', enum: ['y', 'n']},
	title: {type: 'string'},
	content: {type: 'string'},
	post_time: {type: 'date'},
	pv: {type:'number'},
	weight: {type: 'number'},
	news_pic: {type: 'string'}
});
exports.News.index({author_id: 1, _id: -1});

exports.Comment = mongolass.model('Comment', {
	author_id: {type: Mongolass.Types.ObjectId},
	content: {type: 'string'},
	newsId: {type: Mongolass.Types.ObjectId}
});
exports.News.index({newsId: 1, _id: 1}).exec();
exports.News.index({author_id: 1, _id: 1}).exec();