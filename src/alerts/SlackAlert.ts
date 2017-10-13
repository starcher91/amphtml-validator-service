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

        post_data.text = this.generateAlertMessage(alert, data);

        this.post_options = {
            url : slackUrl,
            method: "POST",
            json: true,
            body: post_data
        };
    }
}