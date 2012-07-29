var fs = require('fs'),
    jsdom = require('jsdom'),
    request = require('request'),
    url = require('url'),
    mongo = require('mongoskin');


module.exports = function(app){

  var host = process.env.OPENSHIFT_NOSQL_DB_HOST || 'localhost',
      port = process.env.OPENSHIFT_NOSQL_DB_PORT || '27017',
      user = process.env.OPENSHIFT_NOSQL_DB_USERNAME || '',
      pass = process.env.OPENSHIFT_NOSQL_DB_PASSWORD || '';
  
  var userpass = '';
  
  if( !(user === '') )
    userpass = user + ':' + pass + '@';
  
  var db = mongo.db( userpass + host + ':' + port + '/studio?auto_reconnect');

        
	app.get('/features', function(req, res){
  
      db.collection('features').find().toArray(function (err, features) {
      
        res.render('features.jade',
        {
          title: 'features',
          features: features
        });
        
      });
  });
    
    
  app.get('/features/:id/vote/:choice', function(req, res){
  
  
      if( req.params.choice === 'up' ) {
        db.collection('features').update( {id: parseInt( req.params.id )}, 
                                          {$inc: {votes: 1}},
                                          {safe:true},
                                          function(err) {
          if (err) console.warn(err.message);
          else console.log('successfully voted up feature ' + req.params.id );
        });
      }
      
      if( req.params.choice === 'down' ) {
        db.collection('features').update( {id: parseInt( req.params.id )}, 
                                          {$inc: {votes: -1}},
                                          {safe:true},
                                          function(err) {
          if (err) console.warn(err.message);
          else console.log('successfully voted down feature ' + req.params.id );
        });
      }
  
        res.end('You, sir, are epic.');
    });
    
}