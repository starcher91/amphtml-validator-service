const express = require('express');
const app = express();
const ampHtmlValidator = require("amphtml-validator");
const https = require("https");
let pages = require("./config/amppages.json");

app.get('/', function (req, res) {
    res.send();
    pages.forEach(function(item, i) {
        pageRetriever(pages[i], i);
    });
});

var pageRetriever = function (options, i) {
    var cnetReq = https.get(options, function (cnetRes) {
        var body = "";

        let { statusCode } = cnetRes;

        if (statusCode != 200) {
            res.resume();
            return;
        }

        cnetRes.on('data', function (chunk) {
            body += chunk;
        }).on('end', function () {
            pages[i].body = body;
            validate(body, i);
        }).on('error', function (error) {
            console.log(error);
        });
    });
};

var validate = function (body, i) {
    ampHtmlValidator.getInstance().then(function (validator) {
        var result = validator.validateString(body);

        var errorText = ""
        if (result.status !== "PASS") {
            for (var j = 0; j < result.errors.length; j++) {
                var error = result.errors[j];
                var msg = 'line ' + error.line + ', col ' + error.col + ': ' + error.message;
                if (error.specUrl !== null) {
                    msg += ' (see ' + error.specUrl + ')';
                }
                errorText += msg + "\n";
            }
        }
        
        console.log(pages[i].path + " - " + result.status);
        if (errorText) {
            console.log(errorText);
        }
    });
};

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});