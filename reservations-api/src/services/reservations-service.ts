import { CreateReservationDto, ResourceReservationStatusDto, ResourceStatus, UpdateReservationDto } from "../dtos/reservations";
import { ReservationConflictError } from "../errors/resource-conflict-error";
import { ReservationsRepository } from "../repositories/reservations-repository";

export class ReservationsService {
    static async findAll() {
        return await ReservationsRepository.findAll();
    }

    static async findById(id: string) {
        return await ReservationsRepository.findById(id);
    }

    static async create(reservation: CreateReservationDto) {
        const existentReservation = await ReservationsRepository.getByResourceIdAndTimeRange(reservation.resource_id, reservation.start_date, reservation.end_date);
        if (existentReservation) throw new ReservationConflictError(existentReservation);
        const id = await ReservationsRepository.create(reservation);
        return await ReservationsRepository.findById(id);
    }

    static async update(reservation: UpdateReservationDto) {
        const existentReservation = await ReservationsRepository.findById(reservation.id);
        if (!existentReservation) return;
        const resourceId = reservation.resource_id ?? existentReservation.resource_id;
        const startDate = reservation.start_date ?? existentReservation.start_date;
        const endDate = reservation.end_date ?? existentReservation.end_date;
        const conflictReservation = await ReservationsRepository.getByResourceIdAndTimeRange(resourceId, startDate, endDate, reservation.id);
        if (conflictReservation) throw new ReservationConflictError(conflictReservation);
        await ReservationsRepository.update(reservation);
        return await ReservationsRepository.findById(reservation.id);
    }

    static async getResourceStatusByResourceIdAndTime(resourceId: string, inputTime?: number) {
        const date = inputTime != undefined ? new Date(inputTime) : new Date();
        const existentReservation = await ReservationsRepository.getByResourceIdAndTime(resourceId, date);
        const resourceReservationStatusDto: ResourceReservationStatusDto = {
            status: existentReservation ? (existentReservation.active ? ResourceStatus.Reserved : ResourceStatus.Inactive) : ResourceStatus.Free,
            existentReservation,
        };
        return resourceReservationStatusDto;
    }
}
