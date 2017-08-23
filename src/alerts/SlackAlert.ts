import { AbstractAlert } from "./AbstractAlert";

export class SlackAlert extends AbstractAlert {
    constructor(alert: any, data: any) {
        super(alert, data);

        let post_data;
        
        if (!alert.post_data) {
            post_data = {};
        } else {
            post_data = alert.post_data;
        }
        
        let slackUrl = alert.url;
        if (slackUrl === "{replaceThis}" || slackUrl === "") {
            if (process.env.SLACK_HOOK_URL) {
                slackUrl = process.env.SLACK_HOOK_URL;
            } else {
                console.log("Slack URL must be in config file or implemented as an environment variable");
                return;
            }
        }

        let alertText = "";
        data.results.forEach(function(item, i) {
            alertText += "Amp Validation error found on <" + item.page + ">\n";
        });
        post_data.text = alertText;

        this.post_options = {
            url : slackUrl,
            method: "POST",
            json: true,
            body: post_data
        };
    }
}