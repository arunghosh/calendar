// server.js (Express 4.0)
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var app            = express();
var fs = require('fs');



app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 					// log every request to the console
app.use(bodyParser()); 						// pull information from html in POST
app.use(methodOverride()); 					// simulate DELETE and PUT


var router = express.Router();

router.post('/zones', function(req, res) {
  var user = req.body;
for(var i=0; i<req.body.length; i++) {
  fs.appendFile("/home/rawdata/projects/angularJs/calendar2/test",
'{country:\''+req.body[i].country+'\',zoneid:\''+req.body[i].zoneid+'\',offset:\''+
req.body[i].offset+'\'},\n',
   function(err) {
    if(err) {
        console.log(err);
    } else {
    }
}); 
}
});

 


app.use('/api', router);



app.listen(8000);
console.log('Open http://localhost:8000 to access the files now'); 			// shoutout to the user
