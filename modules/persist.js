var mongo = require('mongoskin');
	  
var host = process.env.OPENSHIFT_NOSQL_DB_HOST || 'localhost',
      port = process.env.OPENSHIFT_NOSQL_DB_PORT || '27017',
      user = process.env.OPENSHIFT_NOSQL_DB_USERNAME || '',
      pass = process.env.OPENSHIFT_NOSQL_DB_PASSWORD || '';

var userpass = '';

if( !(user === '') )
      userpass = user + ':' + pass + '@';
  
module.exports = mongo.db( userpass + host + ':' + port + '/studio?auto_reconnect');