
export class InvalidEmailError extends Error {
    constructor(public email?: string) {
        super()
    }
}
