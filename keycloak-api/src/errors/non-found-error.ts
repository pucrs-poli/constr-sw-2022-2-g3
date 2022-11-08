import { BaseError } from "./base-error";

export class NotFoundError extends BaseError {
    constructor() {
        super(404, 'Not found');
    }
}
