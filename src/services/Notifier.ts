import * as rp from "request-promise";
import * as logger from "winston";

import { AlertFactory } from "../alerts/AlertFactory";

export class Notifier {
    sendAlerts(alerts: Array<any>, results) {
        alerts.forEach(function(item, i) {
            let alert = AlertFactory.getAlert(item, { "results": results });

            if (alert) {
                rp(alert.post_options).catch(function(error) {
                    if (error) {
                        logger.error("Error sending alert." + error);
                    }
                });
            } else {
                logger.error("Failure getting alert for alert url " + item.url + ". Is there an alert for that type?");
            }
        });
    }
}