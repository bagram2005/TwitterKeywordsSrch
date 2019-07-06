const Twitter = require('twitter');
const config = require('./config.js');
const T = new Twitter(config);

// Set up your search parameters
const params = {
  q: '#zika #influenza #typhoid #ebola',
  lang: 'en'
}

// Initiate your search using the above paramaters
T.get('search/tweets', params, (err, tweets, response) => {
  // If there is no error, proceed
    console.log(tweets);
})


//console.log("Tweeted by :::>>>" + event.user.name + " :::>>>" + tweets);