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

const tweets = [];
const friendsList = [];
const twitterProfile = [];
const directMessages = [];


app.get('/', function(req, res) {
    res.render('main.pug');
});

//get five most recent tweets
T.get('statuses/user_timeline', {
    count: 5
}, (error, data) => {
    console.log(`${os.EOL}YOUR MOST RECENT TWEETS: ${os.EOL}`);
    data.forEach(tweet => {

        let userTweet = {}
        userTweet.Tweet = tweet.text;
        userTweet.Date = tweet.created_at;
        userTweet.Retweets = tweet.retweet_count;
        userTweet.Favorites = tweet.favorite_count;
        tweets.push(userTweet);
    //     console.log(`${tweet.text}`);
    //     console.log(`Originally tweeted on: ${tweet.created_at}`);
    //     console.log(`Number of retweets: ${tweet.retweet_count}`);
    //     console.log(`Favorited: ${tweet.favorite_count} times${os.EOL}`);
     });
    console.log(tweets);
});


//get user profile information
T.get('account/verify_credentials', (error, data) => {

    let profileData = {};
    profileData.name = data.name;
    profileData.screenName = data.screen_name;
    profileData.profileImage = data.profile_image_url;
    console.log(`${os.EOL}YOUR PROFILE INFORMATION IS: ${os.EOL}`);
    // console.log(data.name);
    // console.log(data.screen_name);
    // console.log(data.profile_image_url);
    console.log(profileData);
    twitterProfile.push(profileData);
});


//get five most recent frinds
T.get('friends/list', {
    count: 5
}, (error, data) => {
    console.log(`${os.EOL}YOUR MOST RECENT FRIENDS ARE: ${os.EOL}`);
    data.users.forEach(user => {
        let friends = {};
        friends.ScreenName = user.screen_name;
        friends.Name = user.name;
        friends.ProfileImage = user.profile_image_url;
        friendsList.push(friends);
        //console.log(`${user.screen_name} ${os.EOL}`);
    });
    console.log(friendsList);
});


//get most recent direct messages
T.get('direct_messages', (error, data) => {
  console.log(`${os.EOL}YOUR MOST RECENT DIRECT MESSAGES: ${os.EOL}`);
  data.forEach(message => {
    let messages = {};
    messages.Message = message.text;
    messages.Name = message.sender.name;
    messages.ProfileImage = message.sender.profile_image_url;
    messages.Date = message.sender.created_at;
    directMessages.push(messages);
  });
  console.log(directMessages);
});


app.listen(port, () => {
    console.log('The server is now running on port 3030. Press CTRL+C to quit.');
});
