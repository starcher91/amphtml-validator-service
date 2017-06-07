# Amp HTML Validation Service

This service is a node web service that accepts a webhook, and will go out and validate a given url for amp validity.
If the given url does not return valid amp, then the service sends a webhook to a slack url of your configuration.

## Config

You will need to create a config.json file that lives in the server directory that will define the pages you are trying to validate.

You can also define the slack url here, or you can use the environment variable `SLACK_HOOK_URL` to specify the slack endpoint to hit.

Feel free to use config-example.json as an example for you to build off of.

## Local Development

* Install Docker and docker-compose
* Create a config.json from the config-example.json in the same directory
* Run `docker-compose up`