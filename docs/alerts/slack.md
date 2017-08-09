# Slack Alerts Config

## type

For slack alerts, this will always be "slack"

## url

This is the url for the slack webhook. For more info on setting up a slack webhook, see [here](https://api.slack.com/incoming-webhooks).

If you only have 1 slack alert, you can override the configuration value with the `SLACK_HOOK_URL` environment variable by putting {replaceThis} or "" as the value for this config option.

## post_data (optional)

This is a bucket for any other data you want to POST to the slack webhook. This can include a channel override, or a custom username. Again, see [here](https://api.slack.com/incoming-webhooks) for more info on slack webhooks.

## Example

```json
{
    "type": "slack",
    "url": "https://hooks.slack.com/services/blahblahblahblahblah",
    "post_data": {
        "channel": "#some-channel",
        "username": "Amp Validator",
        "icon_emoji": ":+1:"
    }
}
```