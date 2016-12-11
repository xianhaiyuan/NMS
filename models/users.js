var User = require('../db/mongo').User;
module.exports = {
	create: function create(user){
		return User.create(user).exec();
	},
	getUserByName: function getUserByName(username){
		return User
		.find({username: username})
		.addCreatedAt()
		.exec();
	}
}