var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');

var multer  = require('multer');


var indexController = require('./controllers/index.js');
var loginController = require('./controllers/login.js');
var adminController = require('./controllers/admin');
var userController = require('./controllers/users');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/uploads/')
  },
  filename: function (req, file, cb) {
    var fileNameSpaceless = (file.originalname).replace(/\s/g, '');

  	fs.exists('public/img/uploads/' + fileNameSpaceless, function(exists) {
    var uploadedFileName;

	    if (exists) {
	    	console.log('gots in here', typeof file.originalname)
	        uploadedFileName = (Date.now() + '_' + file.originalname).replace(/\s/g, '');
	    } else {
	        uploadedFileName = fileNameSpaceless;
	    } 
	    cb(null, uploadedFileName)

	});
    
  }
})

var upload = multer({ storage: storage });



var passport = require('passport');
var passportConfig = require('./config/passport');


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/geomsgs');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));



var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));


app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));


app.use(cookieParser());
app.use(flash());

app.use(passport.initialize());

app.use(passport.session());

// var Message = require('./models/messages.js');
// var count = 0;

// app.use(function(req, res, next){
// 	if(count === 0){
// 		var newMsg = new Message({
// 			location: {
// 				coordinates: [27.1580, -80.19289]
// 			},
// 			datetime: new Date(),
// 			postedBy: "58b644eeb3048b047c65848f"
// 		});

// 		newMsg.save(function(err, data){

// 		})

// 		count++;
// 	}else{
// 		Message.find({}).populate("postedBy").exec(function(err, data){
// 			console.log(data);
// 		})
// 	}


// })




// Our get request for viewing the login page
app.get('/login', adminController.login);

// Post received from submitting the login form
app.post('/login', adminController.processLogin);

// Post received from submitting the signup form
app.post('/signup', adminController.processSignup);

// Any requests to log out can be handled at this url
app.get('/logout', adminController.logout);




app.get('/', loginController.login);
app.get('/createacct', function (req, res) {
  res.render('createacct');
});


app.use(passportConfig.isLoggedIn);



//////////////////////////////////////////////////////////////////////////////////////





app.get('/home', indexController.index);
app.get('/msgs', indexController.msgs);
app.post('/locate', userController.locate);
app.post('/addmsg', upload.single('uploadedimg'), userController.addMsg);
app.get('/explore', userController.explore);





var server = app.listen(8888, function() {
	console.log('Express server listening on port ' + server.address().port);
});
