const Twitter = require('twitter');
const fs = require('fs');
const config = require('./config.js');
const T = new Twitter(config);

// Set up your search parameters
const params = {
  q: 'zika OR influenza OR typhoid OR ebola OR lyme OR std OR measles OR yellow fever OR enterovirus OR tick borne disease OR mosquito borne disease OR natural disaster OR common cold OR pneumonia OR tetanus OR mumps OR legionnaires OR meningitis',
  lang: 'en'
}

// Initiate your search using the above paramaters
T.get('search/tweets', params, (err, tweets, response) => {
  if (err) {
    console.log('error has occurred. Check log file.')
  } else {
    var resultData = "";
    var resData = tweets.statuses;
    resData.forEach((data, index) => {
      resultData = resultData + "tweet " + index + ": \n\tcreated_at: " + data['created_at'] + "\n\t";
      if (data['coordinates'] == null)
        resultData = resultData + "coordinates: unknown \n\t";
      else 
        resultData = resultData + "coordinates: " + data['coordinates']['type'] + "(" + data['coordinates']['coordinates'][0] + "," + data['coordinates']['coordinates'][1] + ")\n\t";
      resultData = resultData + "text: " + data['text'] + "\n\n";
    });
    console.log(resultData)
    fs.writeFile('./results.txt', resultData, function(err) {
      if(err) {
        return console.log(err);
      }  
      console.log("The file was saved!");
    }); 
  }
  
})
