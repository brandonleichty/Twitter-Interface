const express = require('express')
const pug = require('pug');
const twit = require('twit');
const os = require('os');
const config = require('../config.js');

const port = 3030;


const app = express();
var T = new twit(config);


app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



app.get('/', function(req, res){
  res.render('main.pug');
});

//get five most recent tweets
T.get('statuses/user_timeline', {count: 5}, (err, data) => {
  data.map(element => {
    console.log(`${element.text} ${os.EOL}`);
  });
});


//get user profile information
T.get('account/verify_credentials', (error, data) => {
  console.log(data.profile_image_url);
});


app.listen(port, () => {
  console.log('The server is now running on port 3030. Press CTRL+C to quit.');
});
