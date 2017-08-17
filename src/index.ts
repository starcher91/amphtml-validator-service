import * as express from "express";
import * as config from "./config";
import { Validator } from "./services/Validator";
import { Notifier } from "./services/Notifier";

const app = express();

app.get("/", function(req, res) {
    //go ahead and send the response so the requester isn't waiting
    res.send();

    //error out if no config setup
    if (!config) {
        console.log("You need to define a config file for the service to work");
        throw new Error();
    }

    //set up state
    let state = {
        validationErrors: [],
        validationPasses: []
    };
    
    //for each page in config, retrieve and validate the HTML, then send alerts if necessary
    let validator = new Validator();
    config.pages.forEach(function(item, i) {
        validator.validate(item).then(function(validationResult) {
            if (validationResult.status !== "PASS") {
                state.validationErrors.push({ "result": validationResult, "page": item });
            } else {
                state.validationPasses.push({ "result": validationResult, "page": item });
            }
            
            //validated all pages sent and there are errors, send alerts
            if (state.validationErrors.length != 0 && state.validationErrors.length + state.validationPasses.length == config.pages.length) {
                let notifier = new Notifier();
                notifier.sendAlerts(config.alerts, state.validationErrors);
            }
        });
    });
});

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