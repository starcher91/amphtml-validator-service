const express = require('express');
const app = express();
const ampHtmlValidator = require("amphtml-validator");
const https = require("https");
const request = require("request");
let config = require("./config.json");

if (!config) {
    console.log("You need to define a config file for the service to work");
    throw new Error();
}

app.get('/', function (req, res) {
    res.send();
    config.pages.forEach(function(item, i) {
        pageRetriever(config.pages[i], i);
    });
});

var pageRetriever = function (page) {
    request(page, function(error, response, body) {
        if (error) {
            console.log(error);
        }

        if (response && response.statusCode != 200) {
            return;
        }

        validate(body, page);
    });
};

var validate = function (body, page) {
    ampHtmlValidator.getInstance().then(function (validator) {
        var result = validator.validateString(body);

        if (result.status !== "PASS") {
            sendNotifications(result, page);
        }
    });
};

var sendNotifications = function(result, page) {
    config.alerts.forEach(function(item, i) {
        let alert = "";
        try {
            alert = require("./alerts/" + item.type)(item, { "page": page });
        } catch (e) {
            console.log("Failure requiring alert by type. Does your alert type exist as a module in the alerts directory?");
            console.log(e);
            throw e;
        }

        if (alert) {
            request(alert.post_options, function(error, response, body) {
                if (error) {
                    console.log(error);
                }

                if (response && response.statusCode != 200) {
                    return;
                }
            });
        }
    });
}

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

app.use(function(error, req, res, next) {
    if (!error) {
        next();
    } else {
        console.error(error.stack);
        res.send(500);
    }
});