import { Reservation } from "../models/reservations";

export interface CreateReservationDto extends Omit<Reservation, 'id'> {}
