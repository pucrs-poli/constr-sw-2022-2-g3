import { Reservation } from "../models/reservations";
import { ResourceDto } from "./resources";

export type CreateReservationDto = Omit<Reservation, 'id' | 'active' | 'observation'> & Pick<Reservation, 'active' | 'observation'>;
export type UpdateReservationDto = Pick<Reservation, 'id'> & Partial<CreateReservationDto>;

export interface ReservationDto extends Reservation {
    resource?: ResourceDto;
}
