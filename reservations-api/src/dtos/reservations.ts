import { Reservation } from "../models/reservations";

export type CreateReservationDto = Omit<Reservation, 'id'>;
export type UpdateReservationDto = Pick<Reservation, 'id'> & Partial<CreateReservationDto>;

export interface ResourceReservationStatusDto {
    status: ResourceStatus;
    existentReservation?: Reservation;
}

export enum ResourceStatus {
    Reserved = 'RESERVED',
    Free = 'FREE',
    Inactive = 'INACTIVE',
}
