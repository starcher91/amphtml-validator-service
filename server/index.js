const express = require('express');
const app = express();
const ampHtmlValidator = require("amphtml-validator");
const https = require('https');

app.get('/', function (req, res) {

  ampHtmlValidator.getInstance().then(function(validator) {
    var options = {
      host: 'www.cnet.com',
      port: "443",
      path: '/google-amp/news/apple-wwdc-developers-google-facebook-microsoft-amazon-ar-ai-siri/?setDevice=mobile'
    };

    var cnetReq = https.get(options, function(cnetRes) {
      var body = "";

      let { statusCode } = cnetRes;

      if (statusCode != 200) {
        res.resume();
        return;
      }

      cnetRes.on('data', function(chunk) {
        body += chunk
      }).on('end', function() {
        var result = validator.validateString(body);

        if (result.status !== "PASS") {
          var errorText = ""
          for (var i = 0; i < result.errors.length; i++) {
            var error = result.errors[i];
            var msg = 'line ' + error.line + ', col ' + error.col + ': ' + error.message;
            if (error.specUrl !== null) {
              msg += ' (see ' + error.specUrl + ')';
            }
          errorText += msg + "\n";
          }
          res.send(errorText);
        }

        res.send(result.status);
      }).on('error', function(error) {
        res.send(error);
      });
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});