import * as handlebars from "handlebars";

export abstract class AbstractAlert {
    post_options: any;

    //only ever send 20 page examples maximum to avoid generating impossibly long lists
    maxPageErrorCount = 20;

    constructor(alert: any, data: any) {
    }

    generateAlertMessage(alertConfig: any, data: any): string {
        let alertText : string = "";
        //if no template is specified, return a basic description of the alert
        if (!alertConfig.template) {
            for (let i = 0; i < data.results.length && i < this.maxPageErrorCount; i++) {
                alertText += "Amp Validation error found on " + data.results[i].page + "\n";
            }
            return alertText;
        }

        let template = handlebars.compile(alertConfig.template);
        for (let i = 0; i < data.results.length && i < this.maxPageErrorCount; i++) {
            let templateData = {
                "alert": alertConfig,
                "result": data.results[i]
            };

            alertText += template(templateData);
        }
        return alertText;
    }
}