module.exports = {
	port: 3000,
	session: {
		secret: 'nms',
		key: 'nms',
		maxAge: 2592000000
	},
	mongodb: 'mongodb://localhost:27017/nms'
};