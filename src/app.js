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
    res.render('main.pug', {profile: twitterProfile, tweets: tweets, friends: friendsList, messages: directMessages});
});



//get five most recent tweets
T.get('statuses/user_timeline', {
    count: 5
}, (error, data) => {
    console.log(`${os.EOL}YOUR MOST RECENT TWEETS: ${os.EOL}`);
    data.forEach(tweet => {
        let userTweet = {}
        userTweet.text = tweet.text;
        userTweet.created_at = tweet.created_at;
        userTweet.retweet_count = tweet.retweet_count;
        userTweet.favorite_count = tweet.favorite_count;
        userTweet.profile_image_url = tweet.user.profile_image_url;
        userTweet.name = tweet.user.name;
        userTweet.screen_name = tweet.user.screen_name;
        tweets.push(userTweet);
    });
    console.log(tweets);
});



//get user profile information
T.get('account/verify_credentials', (error, data) => {

    let profileData = {};
    profileData.name = data.name;
    profileData.screen_name = data.screen_name;
    profileData.profile_image_url = data.profile_image_url;
    profileData.friends_count = data.friends_count;
    console.log(`${os.EOL}YOUR PROFILE INFORMATION IS: ${os.EOL}`);
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
        friends.screen_name = user.screen_name;
        friends.name = user.name;
        friends.profile_image_url = user.profile_image_url;
        friendsList.push(friends);
    });
    console.log(friendsList);
});



//get most recent direct messages
T.get('direct_messages', (error, data) => {
    console.log(`${os.EOL}YOUR MOST RECENT DIRECT MESSAGES: ${os.EOL}`);
    data.forEach(message => {
        let messages = {};
        messages.text = message.text;
        messages.name = message.sender.name;
        messages.profile_image_url = message.sender.profile_image_url;
        messages.created_at = message.sender.created_at;
        directMessages.push(messages);
    });
    console.log(directMessages);
});




app.listen(port, () => {
    console.log('The server is now running on port 3030. Press CTRL+C to quit.');
});
