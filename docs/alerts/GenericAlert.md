# Generic Alerts Config

## type

For generic alerts, this will always be "generic"

## post_options

An object that contains all the configuration for a call to the request library. Docs on what data can go in a request object can be found [here](https://github.com/request/request)

## Example

```json
{
    "type": "generic",
    "post_options": {
        "url": "http://alertsite.com",
        "method": "GET"
    }
}
```