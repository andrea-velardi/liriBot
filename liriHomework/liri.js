//require data from sources - both npm packages and local files

require("dotenv").config(); 

    var twitter = require('twitter');
    var Spotify = require('node-spotify-api');
    var request = require('request');
    var fs = require('fs');
    
    var keys = require('./keys.js'); //look in the current folder
    var twitterKeys = keys.twitter;
    var spotifyKeys = keys.spotify;
    
    //the data from process.argv stored in commandArgs (command line Arguments)
    var commandArgs = process.argv;
    
    //starting at index two 
    var liriCommand = commandArgs[2];
    
    // for loop starting at index three for the movie chosen or song chosen
    var liriArg = '';
    for (var i = 3; i < commandArgs.length; i++) {
      liriArg += commandArgs[i] + ' ';
    }
    
    function retrieveTweets() {
      //will only run when we call the function
      fs.appendFile('./log.txt', 'User Command: node liri.js my-tweets\n\n', (err) => {
        if (err) throw err;
      });
    
      
      var client = new twitter(twitterKeys);
    
      
      var params = {screen_name: '@agvelardi', count: 20};//inserted twitter name to grab the last 20 tweets
    
    
      client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
          var errorStr = 'ERROR: Retrieving user tweets -- ' + error;
    
          
          fs.appendFile('./log.txt', errorStr, (err) => {
            if (err) throw err;
            console.log(errorStr);
          });
          return;
        } else {
          
          var outputStr = '------------------------\n' +
                  'User Tweets:\n' + 
                  '------------------------\n\n';
    //loop through all of the tweets and list the created on and tweet text 
          for (var i = 0; i < tweets.length; i++) {
            outputStr += 'Created on: ' + tweets[i].created_at + '\n' + 
                  'Tweet content: ' + tweets[i].text + '\n' +
                  '------------------------\n';
          }
    
          
          fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
            if (err) throw err;
            console.log(outputStr);
          });
        }
      });
    }
    
    
    
    function spotifySong(song) {
      
      fs.appendFile('./log.txt', 'User Command: node liri.js spotify-this-song ' + song + '\n\n', (err) => {
        if (err) throw err;
      });
    
      var spotify = new Spotify(keys.spotify); //constructor function
    
      
      var search;
      if (song === '') {//if the user does not enter anything
        search = 'The Sign Ace Of Base';//default song
      } else {
        search = song;
      }
      
      spotify.search({ type: 'track', query: search}, function(error, data) {
          if (error) {
          var errorStr1 = 'ERROR: Retrieving Spotify track -- ' + error;
    
          
          fs.appendFile('./log.txt', errorStr1, (err) => {
            if (err) throw err;
            console.log(errorStr1);
          });
          return;
          } else {
          var songInfo = data.tracks.items[0];
          if (!songInfo) {
            var errorStr2 = 'ERROR: No song info retrieved, please check the spelling of the song name!';
    
            
            fs.appendFile('./log.txt', errorStr2, (err) => {
              if (err) throw err;
              console.log(errorStr2);
            });
            return;
          } else {
            //the results of the songs searched 
            var outputStr = '------------------------\n' + 
                    'Song Information:\n' + 
                    '------------------------\n\n' + 
                    'Song Name: ' + songInfo.name + '\n'+ 
                    'Artist: ' + songInfo.artists[0].name + '\n' + 
                    'Album: ' + songInfo.album.name + '\n' + 
                    'Preview Here: ' + songInfo.preview_url + '\n';
    
            
            fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
              if (err) throw err;
              console.log(outputStr);
            });
          }
          }
      });
    }
    
    
    function retrieveOBDBInfo(movie) {
      
      fs.appendFile('./log.txt', 'User Command: node liri.js movie-this ' + movie + '\n\n', (err) => {
        if (err) throw err;
      });
    
      
      var search;
      if (movie === '') {//if the search is blank then search Mr. Nobody
        search = 'Mr. Nobody';
      } else {
        search = movie;
      }
    
      
      search = search.split(' ').join('+');
    
      
      var queryStr = "https://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";
    
      request(queryStr, function (error, response, body) {
        if ( error || (response.statusCode !== 200) ) {
          var errorStr1 = 'ERROR: Retrieving OMDB entry -- ' + error;
    
          
          fs.appendFile('./log.txt', errorStr1, (err) => {
            if (err) throw err;
            console.log(errorStr1);
          });
          return;
        } else {
          var data = JSON.parse(body);
          if (!data.Title && !data.Released && !data.imdbRating) {
            var errorStr2 = 'ERROR: No movie info retrieved, please check the spelling of the movie name!';
    
            fs.appendFile('./log.txt', errorStr2, (err) => {
              if (err) throw err;
              console.log(errorStr2);
            });
            return;
          } else {
              
              var outputStr = '------------------------\n' + 
                    'Movie Information:\n' + 
                    '------------------------\n\n' +
                    'Movie Title: ' + data.Title + '\n' + 
                    'Year Released: ' + data.Released + '\n' +
                    'IMBD Rating: ' + data.imdbRating + '\n' +
                    'Country Produced: ' + data.Country + '\n' +
                    'Language: ' + data.Language + '\n' +
                    'Plot: ' + data.Plot + '\n' +
                    'Actors: ' + data.Actors + '\n' + 
                    'Rotten Tomatoes Rating: ' + data.tomatoRating + '\n' +
                    'Rotten Tomatoes URL: ' + data.tomatoURL + '\n';
    
            
            fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
              if (err) throw err;
              console.log(outputStr);
            });
          }
        }
      });
    }
    
    
    function doAsYourTold() {
      
      fs.appendFile('./log.txt', 'User Command: node liri.js do-what-it-says\n\n', (err) => {
        if (err) throw err;//callback
      });
    
      
      fs.readFile('./random.txt', 'utf8', function (error, data) {
        if (error) {
          console.log('ERROR: Reading random.txt -- ' + error);
          return;
        } else {
          
          var cmdString = data.split(',');
          var command = cmdString[0].trim();
          var param = cmdString[1].trim();
    
          switch(command) {
            case 'my-tweets':
              retrieveTweets(); 
              break;
    
            case 'spotify-this-song':
              spotifySong(param);
              break;
    
            case 'movie-this':
              retrieveOBDBInfo(param);
              break;
          }
        }
      });
    }
    
    //calling the functions based on what the user types in as a command
    if (liriCommand === 'my-tweets') {
      retrieveTweets(); 
    
    } else if (liriCommand === `spotify-this-song`) {
      spotifySong(liriArg);
    
    } else if (liriCommand === `movie-this`) {
      retrieveOBDBInfo(liriArg);
    
    } else if (liriCommand ===  `do-what-it-says`) {
      doAsYourTold();
    
    } else {
      
      fs.appendFile('./log.txt', 'User Command: ' + commandArgs + '\n\n', (err) => {
        if (err) throw err;
    
        
        outputStr = 'Usage:\n' + 
              '    node liri.js my-tweets\n' + 
              '    node liri.js spotify-this-song "<song_name>"\n' + 
              '    node liri.js movie-this "<movie_name>"\n' + 
              '    node liri.js do-what-it-says\n';
    
        
        fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
          if (err) throw err;
          console.log(outputStr);
        });
      });
    }