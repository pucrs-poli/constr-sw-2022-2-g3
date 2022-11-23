import { BaseError } from "./base-error";

export class ResourcesServiceUnhandledStatusError extends BaseError {
    constructor(private returnedStatus: number, private returnedData: any) {
        super(500);
    }

    createBody() {
        return {
            ...super.createBody(),
            returnedStatus: this.returnedStatus,
            returnedData: this.returnedData,
        };
    }
}
