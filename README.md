# Amp HTML Validation Service

This service is a node web service that accepts a webhook, and will go out and validate a given url for amp validity.
If the given url does not return valid amp, then the service sends a webhook to a slack url of your configuration.

## Config

You will need to create a config.json file that lives in the src directory.
Feel free to use config-example.json as an example for you to build off of. 

* pages
    * An array of urls to validate
* alerts
    * An array of alerts, which MUST have a type that corresponds to an alert module in the src/alerts folder

## Local Development

* Install Docker and docker-compose
* Create a config.json from the config-example.json in the same directory
* Run `docker-compose up`