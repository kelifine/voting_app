var path = require('path');
var bodyParser = require('body-parser');
var Label = require('./charts/label');
var pug = require('pug');
var htmlColors = require('html-colors');


module.exports = function (app, passport) {

    
app.use(bodyParser.urlencoded({ extended: true }));

var header, title, options, chartid, ids, allCharts, data, button, authenticated, owner, novote, thisurl;
var colors = [];

//find chart
function findChartById (number, callback) {
    Label.findOne({_id: number}, function (err, label) {
        if (err) return (console.log(err));
        title = label.options.title;
        options = label.data.labels;
        data = label.data.data;
        for (var i = 0; i<options.length; i++) {
            var random = htmlColors.random();
            colors.push(random);
        }
        owner = label.owner;
        callback();
    });
}

function findChartByOwner (name, callback) {
    Label.find({owner: name}).select('_id options.title').exec(function (err, labels) {
        if (err) return (console.log(err));
        ids = labels;
        callback();
    });
}

function findAll (callback) {
    Label.find({}).select('_id options.title').exec(function (err, labels) {
        if (err) return (console.log(err));
       allCharts = labels;
       callback();
    });
}

function addVote(thisvote, customoption, ip, callback) {
    Label.findById(chartid, function (err, label) {
        if (err) return console.log(err);
        if (label.users.indexOf(ip)!==-1) {
            if (customoption==='') {
                label.data.data[thisvote] +=1;
                label.markModified('data.data');
                label.users.push(ip);
                label.markModified('users');
                label.save();
                data = label.data.data;
                callback();
                }
            else {
                label.data.labels.push(customoption);
                label.data.data.push(1);
                label.markModified('data.labels');
                label.markModified('data.data');
                label.users.push(ip);
                label.markModified('users');
                label.save();
                callback();
            }
            }    
        else {
            novote = "You have already voted.";
            callback();
        }        
        });
}

function removeChart(chartid, callback) {
    Label.findById(chartid, function(err, label) {
        if (err) return console.log(err); 
        label.remove();
    });
}


//Set header depending on whether user is logged in
function loggedIn (req) {
    if (req.isAuthenticated()) {
        var user = req.user.toObject().username;
        if (user === owner) {
            button='display:inline'; 
        }
        else {
            button='display:none';
        }
        header = pug.renderFile(path.join(__dirname, '../pug/loggedin.pug'), {welcome: "Welcome "+user+"!"});
        authenticated = "Vote on any poll below or click new poll or my polls to create and manage your polls.";
    }
    else {
        header = pug.renderFile(path.join(__dirname, '../pug/login.pug'), {welcome: ""});
        authenticated = "Click on a poll to vote and see results or sign in to create a new poll";
        button='display:none';
    }
}


app.route('/')
    .get(function(req,res) {
        novote = '';
        loggedIn(req);
        findAll(function() {
        var main = pug.renderFile(path.join(__dirname, '../pug/main.pug'), {title: authenticated, items:allCharts});
        res.send(header+main);   
        });   
    });
    
app.route('/logout')
    .get(function(req,res) {
        novote = '';
        req.logOut();
        req.session.destroy(function(err) {
            if (err) return console.log(err);
            res.clearCookie('connect.sid');
            findAll(function() {
            loggedIn(req);
            var main = pug.renderFile(path.join(__dirname, '../pug/main.pug'), {title: authenticated, items:allCharts});
            res.send(header+main); 
        });
        });
    });
    
app.route('/auth/github')
  .get(passport.authenticate('github', {session: false}));

app.route('/auth/github/callback') 
 		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/auth/github'
		}));
		
app.route('/createChart')
    .get(function(req,res) {
        novote = '';
        var createChart = pug.renderFile(path.join(__dirname, '../pug/createchart.pug'));
        res.send(createChart);
    });

app.route('/newchart')
    .post(function(req,res) {
    var newChart = new Label();
    newChart.owner = req.user.toObject().username;
    newChart.options.title = req.body.title;
    newChart.data.labels = req.body.options.split(', ');
    newChart.data.data = [0, 0, 0];
    newChart.save(function(err) {
        if (err) return (console.log(err));
        });
    chartid = newChart._id;
    res.redirect('/chart/'+newChart._id);
    });

app.route('/chart/:id') 
    .get(function(req,res) {
        chartid = req.path.substring(7);
        var thisurl = req.protocol + '://' + req.get('host') + req.originalUrl;
        findChartById(chartid, function() {
        loggedIn(req);
        var select = pug.renderFile(path.join(__dirname, '../pug/chart.pug'), {title: "'"+title+"'", labels: options, numbers: '['+data+']', color: colors, button: button, alert: novote, url: thisurl});
        res.send(header+select);    
        });
    });
    
app.route('/myPolls')
    .get(function(req,res){
        novote = '';
        var owner = req.user.toObject().username;
        findChartByOwner(owner, function(){
        loggedIn(req);
        var main = pug.renderFile(path.join(__dirname, '../pug/main.pug'), {title: "Your polls:", items: ids});
        res.send(header+main);    
        });
    });
    
app.route('/vote')
    .post(function(req, res){
        var ip = req.ip;
        var thisvote = req.body.thisvote;
        var customoption = req.body.customoption;
        addVote(thisvote, customoption, ip, function() {
        res.redirect('/chart/'+chartid);
        });
    });
    
app.route('/remove')
    .get(function(req, res){
        novote = '';
        removeChart(chartid, function() {
           console.log('chart removed.'); 
        });
        res.redirect('/');
    });
    
};
