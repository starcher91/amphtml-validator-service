import * as express from "express";
import * as bodyParser from "body-parser";
import * as logger from "winston";

import * as config from "./config";
import { Validator } from "./services/Validator";
import { Notifier } from "./services/Notifier";

const app = express();

app.use(function(error, req, res, next) {
    if (!error) {
        next();
    } else {
        logger.error(error.stack);
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
        let errorMessage: string = "You need to define a config file for the GET endpoint to work";
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }

    validateAndAlert(config);
});

app.post("/", function(req, res) {
    //go ahead and send the response so the requester isn't waiting
    res.send();

    //validate inputs
    if (!req.body.pages || !req.body.alerts) {
        let errorMessage: string = "You need at least one url and alert specified in POST data to use this endpoint.";
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }

    validateAndAlert(req.body);
});

const validateAndAlert = function(config) {
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
        }).catch(function(error) {
            logger.error(error);
        });
    });
}

app.listen(3000, function () {
    //configure global app logging
    logger.configure({
        level: process.env.NODE_ENV == "prod" ? "warn" : "silly",
        transports: [new logger.transports.Console()]
    });
    logger.info("App listening on port 3000");
});