var jsdom = require('jsdom'),
    request = require('request'),
    url = require('url'),
	jQuery = require('jquery');
	
var jQueryUrl = require.resolve('jquery');
	
module.exports.crawl = function( url, callback ) {

	request( {uri: url}, function(err, response, body) {
		jsdom.env(url, ['http://code.jquery.com/jquery-1.7.min.js'], //[jQueryUrl]
			function(err, window){
					response.window = window
			
					callback( err, response, window.jQuery );
				});
			});
			
		jsdom.env(response.content,[toQueue.jQueryUrl],function(errors,window) {
                              if (errors) return toQueue.callback(errors);
                              
							  var $ = window.jQuery;
                              response.window = window;
                              toQueue.callback(null,response,$);
                            });
}
	



