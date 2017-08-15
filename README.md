# Amp HTML Validation Service

This service is a node web service that accepts a webhook, and will go out and validate a given url for amp validity.
If the given url does not return valid amp, then the service sends a webhook to a slack url of your configuration.

## Config

You will need to create a config.ts file that lives in the src directory.

### Pages
An array of urls to validate. Here is an example:
```javascript
export var alerts = [];

export var pages = [
    "https://www.site.com/amp/article1",
    "https://www.site.com/amp/article2",
    "https://www.site.com/amp/article3"
]
```

### Alerts
An array of alerts. This section of the config specifies what to alert and how if the validator finds an issue. 
For more information on configuring for specific alert types and a full example, see [this folder](docs/alerts)

#### Type (required)
The type of the alert. This corresponds to any alert type, which can be found as individual modules in the src/alerts folder.

#### URL (required)
The url to send the alert to.

#### Example

```javascript
export var alerts = [
    {
        "type": "slack",
        "url": "https://hooks.slack.com/services/blahblahblahblahblah"
    },
    {
        "type": "slack",
        "url": "https://hooks.slack.com/services/blahblahblahblahblah2"
    }
];

export var pages = [];
```

## Local Development

* Install Docker and docker-compose
* Create a config.json from the config-example.json in the same directory
* Run `docker-compose up`