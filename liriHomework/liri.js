
var Twitter = require('twitter');

// var client = new Twitter(keys.twitter);

var keys = require('./keys.js'); 
console.log(keys); 

function myTweets(){
    var client = new Twitter({
        consumer_key: '',//replace with line 4
        consumer_secret: '',
        access_token_key: '',
        access_token_secret: ''
      });
       
      var params = {screen_name: 'nodejs'};
      client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
          console.log(tweets);
        }
      });
}

