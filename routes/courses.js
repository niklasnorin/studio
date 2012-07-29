
module.exports = function(app){

  var courses = [
			{
				code: 'TNA007',
				name: 'Vektoranalys',
				points: 6,
				scheduled: [
					{
						year: 2012,
						semester: 'VT',
						period: [1]
					},
					{
						year: 2011,
						semester: 'VT',
						period: [1]
					}
				]
			},
			{
				code: 'TNG032',
				name: 'Transformteori',
				points: 6,
				scheduled: [
					{
						year: 2012,
						semester: 'HT',
						period: [2]
					},
					{
						year: 2011,
						semester: 'HT',
						period: [2]
					}
				]
			}
		];

	app.get('/courses', function(req, res){
        res.render('courses.jade',
			{
				title: 'courses',
        courses: courses
			});
    });
    
}