# Generic Alerts Config

## type

For generic alerts, this will always be "generic"

## post_options

An object that contains all the configuration for a call to the request library. Docs on what data can go in a request object can be found [here](https://github.com/request/request)

## Custom Text

### textProperty

This property is required if you want any kind of text sent in the body of your request. This is the NAME of the property that will be populated on your request.

### template

This is a handlebars template that gets used to generate the text that gets put in the ping. For more info on handlebars templates in general, see [here](http://handlebarsjs.com/). For more info on what data you have access to in the template, see [here](handlebars)

## Example

```json
{
    "type": "generic",
    "post_options": {
        "url": "http://alertsite.com",
        "method": "GET"
    },
    "textProperty": "text",
    "template": "Amp Validation error found on {{result.page}}\n"
}
```