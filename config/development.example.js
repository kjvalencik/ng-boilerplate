// Config settings for NODE_ENV=development

exports.config = {
	port: 3000,
	host: 'http://localhost:3000',
	staticMounts: ['build'],
	session: {
		secret: 'this is really secure',
		maxAge: new Date(Date.now() + 3600000)
	},
	redis  : { host : 'localhost' }
};