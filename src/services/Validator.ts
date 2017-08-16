import * as rp from "request-promise";
import * as ampHtmlValidator from "amphtml-validator";

export class Validator {
    async validate (page: string) : Promise<any> {
        let response = await rp(page);
        let validator = await ampHtmlValidator.getInstance();
        return Promise.resolve(validator.validateString(response));
    }
}