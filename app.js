const Twitter = require('twitter');
const fs = require('fs');
const config = require('./config.js');
const T = new Twitter(config);

// Set up your search parameters
let query = 'ebola OR tick AND borne AND disease OR tetanus OR mosquito OR zika OR natural OR pneumonia OR mumps';
const params = {
  //q: 'zika ebola',
  q: query,  // OR tick borne disease OR mosquito borne disease OR natural disaster OR common cold OR pneumonia OR tetanus OR mumps OR legionnaires OR meningitis
  lang: 'en',
  count: 100
}

// Initiate your search using the above paramaters
T.get('search/tweets', params, (error, tweets, response) => {
  if (error) {
    console.log('error has occurred. Check log file =>' + JSON.stringify(error))
  } else {
    var resultData = '';
    var resData = tweets.statuses;
    var dataList = classifySearchedData(query, resData);
    resultData = (dataList.length == 0) ? "no result" : objectList2str(dataList);

    // write result
    fs.writeFile('./results.txt', resultData, function(err) {
      if(err) {
        return console.log(err);
      }  
      console.log("The file was saved!");
    }); 
  }  
})

/*
 * Name       : classifySearchedData
 * Parameter  : query and result of twitter search API
 * Return     : array sorted by each word in query
 * contents   : classify searched result data by using each word in query
 * Created_at : July 12th 2019
 * Author     : ChengXin
 */
const classifySearchedData = (query, searchedTweets) => {
  // define variables
  let queryList = query.split(' OR ');      // get array of each word in query with string ' OR ' 
  let resultDataList = [];

  queryList.forEach(word => {               // search tweets by each word in query
    // define variables
    var i = 0;
    var resultData = '';

    word = word.replace( / AND /gi, ' ');   // replace from " AND " to " ". exp: tick AND borne AND disease => tick borne disease
    searchedTweets.forEach( data => {
      // define variables
      var search_word = word.split(' ');
      var flag_search = true;

      search_word.forEach (each => {
        flag_search = flag_search & (data['text'].indexOf(each) > 0);     // determine whether the word is in the data['text']
      });
      if (flag_search) {
        // make string for print
        resultData = resultData + "tweet " + i + ": \n\t\tcreated_at: " + data['created_at'] + "\n\t\t";
        if (data['coordinates'] == null)
          resultData = resultData + "coordinates: unknown \n\t\t";
        else 
          resultData = resultData + "coordinates: " + data['coordinates']['type'] + "(" + data['coordinates']['coordinates'][0] + "," + data['coordinates']['coordinates'][1] + ")\n\t";
        resultData = resultData + "text: " + data['text'] + "\n\n\t";
        i++;
      }
    });
    // push data to array
    resultDataList.push({'key': word, "data": resultData, "count": i});
  });
  // console.log(resultDataList);
  return resultDataList;
}

/*
 * Name       : objectList2str
 * Parameter  : list of object
 * Return     : string
 * contents   : convert list of object to string.
 * Created_at : July 12th 2019
 * Author     : ChengXin
 */
const objectList2str = (list) => {
  // define variables
  let returnData = '';

  list.forEach(item => {
    returnData = returnData + "search word: " + item['key'] + ",\t count: " + item['count'] + "\n\t";
    returnData = returnData + ((item['count'] == 0) ? "no result\n\n" : item['data'] + "\n\n");
  });
  return returnData;
}