var GitHubStrategy = require('passport-github2').Strategy;
var User = require('./schema');

module.exports = function(passport) {

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GitHubStrategy({
		'clientID': process.env.GITHUB_KEY,
		'clientSecret': process.env.GITHUB_SECRET,
		'callbackURL': process.env.APP_URL + 'auth/github/callback'
	},
	function(accessToken, refreshToken, profile, done) {
	   process.nextTick(function () {
	    User.findOne({ 'githubId': profile.githubId }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} 
				else {
					var newUser = new User();

					newUser.githubId = profile.githubId;
					newUser.username = profile.username;
					newUser.displayName = profile.displayName;
						newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
						
					});
				}
	     });
    });
  }

));





};