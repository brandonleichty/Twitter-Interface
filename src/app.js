//TWITTER INTERFACE
//In order to use this Express app you'll need to:
// 1) Add your own Twitter keys and access tokens to the config.js file
// 2) Remove the ".example" from the config.js.example file. It should be titled "config.js"


//Dependencies
const express = require('express')
const pug = require('pug');
const twit = require('twit');
const moment = require('moment');
const os = require('os');
const config = require('../config.js');

const port = 3030;

const currentDate = moment().format('MM/DD/YYYY');

const app = express();
var T = new twit(config);

//Sets the view and templte engine
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

//Variables that store the information retrieved by the Twit/GET request
const tweets = [];
const friendsList = [];
const twitterProfile = {};
const directMessages = [];



app.get('/', function(req, res) {
    res.render('main.pug', {
        profile: twitterProfile,
        tweets: tweets,
        friends: friendsList,
        messages: directMessages
    });
});



//Twit GET function thats retrieves the five most recent tweets of the given user.
//The text, retweet count, number of favorites, profile image, screen name, and username are collected...
//...for each Tweet and then then added to the userTweet object (which will then be injected into the template).
//Moment is used to calculate and display the proper date/time.
T.get('statuses/user_timeline', {
    count: 5
}, (error, data) => {
    data.forEach(tweet => {
        let userTweet = {}
        userTweet.text = tweet.text;
        userTweet.retweet_count = tweet.retweet_count;
        userTweet.favorite_count = tweet.favorite_count;
        userTweet.profile_image_url = tweet.user.profile_image_url;
        userTweet.name = tweet.user.name;
        userTweet.screen_name = tweet.user.screen_name;

        //Takes the UTC time stamp from the given tweet and tells Moment what the format is: "Wed Aug 27 13:08:45 +0000 2008"
        //If the tweet was from the current day, the fromNow() method is used to displays how many seconds, minutes, or hours ago the tweet occured.
        //Otherwise, the date is displayed and formated as 'M/DD/YY'
        if (moment(tweet.created_at, 'ddd MMM D h:mm:ss ZZ YYYY').format('MM/DD/YYYY') === currentDate) {
            userTweet.created_at = moment(tweet.created_at, 'ddd MMM D h:mm:ss ZZ YYYY').fromNow();

            //Else if the tweet was was NOT sent on the current day (today), show the day/date it was sent.
        } else {
            userTweet.created_at = moment(tweet.created_at, 'ddd MMM D h:mm:ss ZZ YYYY').format('M/DD/YY');
        }

        //push Tweet information (userTweet) to "tweets" object
        tweets.push(userTweet);

    });
});



//Gets user profile information and adds it to the twitterProfile object to be injected into the pug/Jade template
T.get('account/verify_credentials', (error, data) => {
    twitterProfile.name = data.name;
    twitterProfile.screen_name = data.screen_name;
    twitterProfile.profile_image_url = data.profile_image_url;
    twitterProfile.friends_count = data.friends_count;
});



//Gets five most recent friends/follows for a given user and stores them in the "friend" object.
T.get('friends/list', {
    count: 5
}, (error, data) => {
    data.users.forEach(user => {
        let friends = {};
        friends.screen_name = user.screen_name;
        friends.name = user.name;
        friends.profile_image_url = user.profile_image_url;
        friendsList.push(friends);
    });
});



//Gets five most recent direct for a given user and stores them in the "friend" object.
T.get('direct_messages', {
    count: 5
}, (error, data) => {
    data.forEach(message => {
        let messages = {};
        messages.text = message.text;
        messages.name = message.sender.name;
        messages.profile_image_url = message.sender.profile_image_url;

        //Takes the UTC time stamp from the given message and tells Moment what the format is: "Wed Aug 27 13:08:45 +0000 2008"
        //If the message was from the current day, the fromNow() method is used to displays how many seconds, minutes, or hours ago the tweet occured.
        //Otherwise, the date is displayed and formated as 'M/DD/YY'
        if (moment(message.created_at, 'ddd MMM D h:mm:ss ZZ YYYY').format('MM/DD/YYYY') === currentDate) {
            messages.created_at = moment(message.created_at, 'ddd MMM D h:mm:ss ZZ YYYY').fromNow();
            //Else if the message was was NOT sent on current day (today), show the day it was sent
        } else {
            messages.created_at = moment(message.created_at, 'ddd MMM D h:mm:ss ZZ YYYY').format('M/DD/YY');
        }
        directMessages.push(messages);
    });
});



//listen on port 3030
app.listen(port, () => {
    console.log(`${os.EOL}The server is now running on port 3030. ${os.EOL}Open your browser and go to: http://localhost:3030/ ${os.EOL}Press CTRL+C to quit.${os.EOL}`);
});
