import * as express from "express";
const app = express();
import * as ampHtmlValidator from "amphtml-validator";
import * as request from "request";
import * as config from "./config";
import { AlertFactory } from "./alerts/AlertFactory";

let state = {
    validatedCount : 0,
    validationErrors: [],
    validationPasses: []
};

if (!config) {
    console.log("You need to define a config file for the service to work");
    throw new Error();
}

app.get('/', function (req, res) {
    //go ahead and send the response so the requester isn't waiting
    res.send();
    //reset state
    state.validatedCount = 0;
    state.validationErrors = [];
    state.validationPasses = [];

    config.pages.forEach(function(item, i) {
        pageRetriever(config.pages[i]);
    });
});

var pageRetriever = function (page) {
    request(page, function(error, response, body) {
        if (error) {
            console.log(error);
        }

        state.validatedCount++;

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
            state.validationErrors.push({ "result": result, "page": page });
        } else {
            state.validationPasses.push({ "result": result, "page": page });
        }
        
        //validated all pages sent and there are errors, send notifications
        if (state.validationErrors.length != 0 && state.validationErrors.length + state.validationPasses.length == config.pages.length) {
            sendNotifications(state.validationErrors);
        }
    });
};

var sendNotifications = function(results) {
    config.alerts.forEach(function(item, i) {
        let alert = AlertFactory.getAlert(item, { "results": results });

        if (alert) {
            request(alert.post_options, function(error, response, body) {
                if (error) {
                    console.log(error);
                }

                if (response && response.statusCode != 200) {
                    console.log("Error sending alert. ${response.statusCode}")
                    return;
                }
            });
        } else {
            throw new Error("Failure getting alert for alert url ${item.url}. Is there an alert for that type?")
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