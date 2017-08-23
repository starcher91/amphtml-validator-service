import { AbstractAlert } from "./AbstractAlert";

export class GenericAlert extends AbstractAlert{
    constructor(alert: any, data: any) {
        super(alert, data);
        this.post_options = alert.post_options;

        //if a text property to set the template to is not defined,
        //or a template is not defined,
        // do not generate the template.
        if (!alert.textProperty || !alert.template) {
            console.log("Generic Alert could not populate text. Consult docs for required fields.");
            return;
        }

        //if the request uses a body, it will be attached there
        if (["PATCH", "PUT", "POST"].indexOf(alert.post_options.method) != -1) {
            this.post_options.body[alert.textProperty] = this.generateAlertMessage(alert, data);
        } else {
            this.post_options[alert.textProperty] = this.generateAlertMessage(alert, data);
        }
    }
}