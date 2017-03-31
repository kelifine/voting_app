var path = require('path');

module.exports = function (app, passport) {


app.route('/')
    .get(function(req,res) {
        res.sendFile(path.join(__dirname, '../public/home.html'));
    });
    
app.route('/logout')
    .get(function(req,res) {
        req.logout();
        res.sendFile(path.join(__dirname, '../public/login.html'));
    });
    
app.route('/auth/github')
  .get(passport.authenticate('github'));

app.route('/auth/github/callback') 
 		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/auth/github'
		}));
		
app.route('/chart') 
    .get(function(req,res) {
        res.sendFile(path.join(__dirname, '../public/chart.html'));
    });

};

