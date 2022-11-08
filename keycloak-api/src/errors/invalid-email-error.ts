import { BaseError } from "./base-error";

export class InvalidEmailError extends BaseError<unknown> {
    constructor(public email?: string) {
        super(400, 'Invalid email',  {
            'user.email': {
                message: 'Invalid email'
            },
        });
    }
}