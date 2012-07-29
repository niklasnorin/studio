var fs = require('fs');

module.exports = function(app){

	// Register all routes in this folder
    fs.readdirSync(__dirname).forEach(function(file) {
        if (file == "index.js") return;
		
		if (fs.statSync(__dirname + '/' + file).isFile()) {
			var name = file.substr(0, file.indexOf('.'));
			require('./' + name)(app);
		}
    });
	
	app.get('/api', function(req, res){
        res.render('index.jade',
			{
				title: 'API Index'
			});
    });
    
}