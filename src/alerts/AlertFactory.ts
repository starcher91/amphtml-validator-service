import { SlackAlert } from "./SlackAlert";
import { GenericAlert } from "./GenericAlert";

export class AlertFactory {
    static getAlert(alertConfig: any, data: any) {
        switch(alertConfig.type) {
            case "slack":
                return new SlackAlert(alertConfig, data);
            case "generic":
                return new GenericAlert(alertConfig, data);
            default:
                return null;
        }
    }
}