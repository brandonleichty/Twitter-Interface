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



app.get('/', function(req, res) {
    res.render('main.pug');
});

//get five most recent tweets
T.get('statuses/user_timeline', {
    count: 5
}, (error, data) => {
    console.log(`${os.EOL}YOUR MOST RECENT TWEETS: ${os.EOL}`);
    data.map(tweet => {
        console.log(`${tweet.text}`);
        console.log(`Originally tweeted on: ${tweet.created_at}`);
        console.log(`Number of retweets: ${tweet.retweet_count}`);
        console.log(`Favorited: ${tweet.favorite_count} times${os.EOL}`);
    });
});


//get user profile information
T.get('account/verify_credentials', (error, data) => {
    console.log(`${os.EOL}YOUR PROFILE INFORMATION IS: ${os.EOL}`);
    console.log(data.name);
    console.log(data.screen_name);
    console.log(data.profile_image_url);
});


//get five most recent frinds
T.get('friends/list', {
    count: 5
}, (error, data) => {
    console.log(`${os.EOL}YOUR MOST RECENT FRIENDS ARE: ${os.EOL}`);
    data.users.forEach(user => {
        console.log(`${user.screen_name} ${os.EOL}`);
    });
});


T.get('direct_messages', (error, data) => {
  data.forEach(message => {
    console.log(message.text);
  });

});


app.listen(port, () => {
    console.log('The server is now running on port 3030. Press CTRL+C to quit.');
});
