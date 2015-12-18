var credentials = require('./credentials.json');

// Require the twilio and HTTP modules
var twilio = require('twilio'),
    http = require('http'),
    qs = require('querystring');
 
var port = process.env.port || 1337;
// Create an HTTP server, listening on port 1337, that
// will respond with a TwiML XML document
http.createServer(function (req, res) {

  if (req.method == 'POST') {
    var body = '';

    req.on('data', function (data) {
      body += data;
    });

    req.on('end', function () {

      var POST = qs.parse(body);

      //validate incoming request is from twilio using your auth token and the header from Twilio
      var token = credentials.prod.authToken,
        header = req.headers['x-twilio-signature'];

      console.log(req);

      //validateRequest returns true if the request originated from Twilio
      if (twilio.validateRequest(token, header, 'http://rpssms.azurewebsites.net/', POST)) {
        //generate a TwiML response
        var resp = new twilio.TwimlResponse();
        resp.say('hello, twilio!');

        res.writeHead(200, { 'Content-Type':'text/xml' });
        res.end(resp.toString());
      } else {
        res.writeHead(403, { 'Content-Type':'text/plain' });
        res.end('you are not twilio - take a hike.');
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type':'text/plain' });
    res.end('send a POST');
  }

}).listen(port);
 
console.log('Visit http://localhost:' + port + '/ in your browser to see your TwiML document!');