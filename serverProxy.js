var express = require('express');
var app = express();
const request = require('request');

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("AI-Custom-Header", "Custom");
  res.append("x-frame-options", "DENY");
  next();
});

/* Default site */
app.get('/', function (req, res) { res.sendFile(__dirname + "/" + "client.html"); console.log("request received for '/' at " + Date()); })


/* proxy for energy australia link */
app.get('/energyAustraliaURL', function (req, res) {
  console.log("request received for '/energyAustraliaURL' at " + Date());

  request(
    { url: 'http://eacodingtest.digital.energyaustralia.com.au/api/v1/festivals' },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.log('error returned from request !!!');
        if (error) {
          if ('message' in error && error) {
            console.log('error returned - no error');
            return res.status(500).json({ type: 'error', message: 'bad or no error message' });
          }
          else {
            console.log('error ', error);
            return res.status(response.statusCode).json({ type: 'error', message: error.message });
          }
        }
      }
      console.log('About the return result', response.statusCode);
      if (response.statusCode == 429) {
        return res.status(response.statusCode).json({ type: 'error', message: "Too many requests, throttling" });
      } else {
        res.json(JSON.parse(body));
      }
    }
  )

});


var server = app.listen(2024, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("MEAN testing app listening at http://%s:%s", host, port)
})
