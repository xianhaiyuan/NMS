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
	},
	update: function update(user){
		return User.update(
		{
			"_id": user._id
		},
		{
			$set: {
				"name": user.name,
				"resume": user.resume,
				"avatar": user.avatar
			}
		});
	}
}