export class SlackAlert {
    post_data: any;
    post_options: any;

    constructor(alert: any, data: any) {
        let slackUrl = alert.url;
        if (slackUrl === "{replaceThis}" || slackUrl === "") {
            if (process.env.SLACK_HOOK_URL) {
                slackUrl = process.env.SLACK_HOOK_URL;
            } else {
                console.log("Slack URL must be in config file or implemented as an environment variable");
                return;
            }
        }

        if (!alert.post_data) {
            this.post_data = {};
        } else {
            this.post_data = alert.post_data;
        }

        let alertText = "";
        data.results.forEach(function(item, i) {
            alertText += "Amp Validation error found on <" + item.page + ">\n";
        });
        this.post_data.text = alertText;

        this.post_options = {
            url : slackUrl,
            method: "POST",
            json: true,
            body: this.post_data
        };
    }
}