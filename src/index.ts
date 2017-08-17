import * as express from "express";
import * as bodyParser from "body-parser";
import * as config from "./config";
import { Validator } from "./services/Validator";
import { Notifier } from "./services/Notifier";

const app = express();

app.use(function(error, req, res, next) {
    if (!error) {
        next();
    } else {
        console.error(error.stack);
        res.status(500).send("Error encountered");
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post("/", function(req, res) {
    //validate inputs
    if (!req.body.url || !req.body.alerts) {
        res.status(400).send("You need at least one url and alert specified in POST data to use this endpoint.");
    }

    //validate url, and send specified alerts
    let validator = new Validator();
    validator.validate(req.body.url).then(function(validationResult) {
        if (validationResult.status !== "PASS") {
            let notifier = new Notifier();
            notifier.sendAlerts(req.body.alerts, [{"result": validationResult, "page": req.body.url}]);
        }
    });
    res.send();
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});