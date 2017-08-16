import { SlackAlert } from "./SlackAlert";

export class AlertFactory {
    static getAlert(alertConfig: any, data: any) {
        if (alertConfig.type == "slack") {
            return new SlackAlert(alertConfig, data);
        } else {
            return null;
        }
    }
}