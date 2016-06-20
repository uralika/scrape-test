var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  res.sendFile( __dirname + "/" + "index.jade" );
});

router.get('/scrape', function(req, res){
    // The URL we will scrape from - in our example Anchorman 2.

    url = 'http://www.yelp.com/biz/wurstk%C3%BCche-los-angeles-2?start=';
    var jsonArray = [];

    for (var i = 0; i <= 1000; i+=20) {
      createRequest(url, i, jsonArray)
    }
    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    // request(url, function(error, response, html){
    //     // First we'll check to make sure no errors occurred when making the request

    //     if(!error){
    //         // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

    //         var $ = cheerio.load(html);

    //         // Finally, we'll define the variables we're going to capture

    //         var date, rating, review;
    //         var array = [];
    //         var count = 0;

    //         // We'll use the unique header class as a starting point

    //         $('.review-content').filter(function() {
    //           var data = $(this);
    //           var json = {};

    //           date = data.find('meta[itemprop="datePublished"]').attr("content");

    //           rating = data.find('meta[itemprop="ratingValue"]').attr("content");

    //            review = data.find('p[itemprop="description"]').text();

    //            json.date = date;
    //            json.rating = rating;
    //            json.review = review

    //            console.log(date);

    //            array.push(json);
    //         })
    //     }

    //     fs.writeFile('output.json', JSON.stringify(array, null, 4), function(err) {

    //       console.log('File successfully written!');
    //     })

    //     res.send('Check your console!');
    // })
})

function createRequest(url, n, jsonArray) {
  request(url + n, function(error, response, html){
      // First we'll check to make sure no errors occurred when making the request

    if(!error){
      // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

      var $ = cheerio.load(html);

      // Finally, we'll define the variables we're going to capture

      var date, rating, review;

      // We'll use the unique header class as a starting point

      $('.review-content').filter(function() {
        var data = $(this);
        var json = {};

        date = data.find('meta[itemprop="datePublished"]').attr("content");

        rating = data.find('meta[itemprop="ratingValue"]').attr("content");

          review = data.find('p[itemprop="description"]').text();

          json.date = date;
          json.rating = rating;
          json.review = review

          jsonArray.push(json);
      })
    }

    if (n >= 1000) {
      fs.writeFile('output.json', JSON.stringify(jsonArray, null, 4), function(err) {

        console.log('File successfully written!');
      })
    }

  })
}

module.exports = router;
