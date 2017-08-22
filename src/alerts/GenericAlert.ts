import { AbstractAlert } from "./AbstractAlert";

export class GenericAlert extends AbstractAlert{
    constructor(alert: any, data: any) {
        super(alert, data);
        this.post_options = alert.post_options;
    }
}