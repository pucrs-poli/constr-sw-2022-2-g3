
export interface Reservation {
    id: number,
    start_date: Date,
    end_date: Date,
    status: ReservationStatus,
    observation: string,
}

export enum ReservationStatus {
    Busy = 'BUSY',
    Free = 'FREE',
}
