
export class BaseError<T=string> extends Error {
    constructor(public status: number, message?: string, public details?: T) {
        super(message)
    }

    createBody() {
        return {message: this.message, details: this.details};
    }
}
