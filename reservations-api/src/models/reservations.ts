
export interface Reservation {
    id: string,
    start_date: Date,
    end_date: Date,
    observation: string,
    resource_id: string,
    active: boolean,
}
