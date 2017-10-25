# Handlebars templating

For the error message templating, we use handlebars for creating error message templates. This doc explains what data we pass to the handlebars compiler that you can make use of in your template.

## alert

This object represents the configuration of the alert that is currently being processed. You can access any field you put on that specific alert config.

For example, given this alert config

```json
{
    "type": "slack",
    "url": "https://hooks.slack.com/services/blahblahblahblahblah",
    "example": "this is a test"
}
```

You could specify the template string to be "{{alert.example}}", which would compile to "this is a test".

## result

This object represents the result of the validation error returned from the amp validator module. Some example code for which properties are accessible on this result are [here](https://www.ampproject.org/docs/guides/validate#command-line-tool)

For example, given this validation result

```json
{
    "status": "FAIL"
    ...
}
```

You could specify the template string to be "{{result.status}}", which would compile to "FAIL"