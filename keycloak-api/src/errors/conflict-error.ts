import { BaseError } from "./base-error";

export class ConflictError extends BaseError {
    constructor() {
        super(409, 'Conflict');
    }
}
