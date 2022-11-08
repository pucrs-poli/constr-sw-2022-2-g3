import { Reservation } from "../models/reservations";
import { ConflictError } from "./conflict-error";

export class ReservationConflictError extends ConflictError {
    constructor(private existentReservation: Reservation) {
        super();
    }

    createBody() {
        return {
            ...super.createBody(),
            existentReservation: this.existentReservation,
        };
    }
}
