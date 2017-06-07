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
    let errorText = "Amp Validation error found on <" + page + ">\n";
    for (let j = 0; j < result.errors.length; j++) {
        let error = result.errors[j];
        let msg = 'line ' + error.line + ', col ' + error.col + ': ' + error.message;
        if (error.specUrl !== null) {
            msg += ' (see ' + error.specUrl + ')';
        }
        errorText += msg + "\n";
    }

    let post_data = {
        "text": errorText
    };

    let slackUrl = config.slackHookUrl;
    if (slackUrl === "{replaceThis}" || slackUrl === "") {
        if (process.env.SLACK_HOOK_URL) {
            slackUrl = process.env.SLACK_HOOK_URL;
        } else {
            console.log("Slack URL must be in config file or implemented as an environment variable");
            return;
        }
    }

    let post_options = {
        url : slackUrl,
        method: "POST",
        json: true,
        body: post_data
    };

    request(post_options, function(error, response, body) {
        if (error) {
            console.log(error);
        }

        if (response && response.statusCode != 200) {
            return;
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