import { CreateReservationDto, UpdateReservationDto } from "../dtos/reservations";
import { ReservationConflictError } from "../errors/resource-conflict-error";
import { ReservationsRepository, ReservationWhereQuery } from "../repositories/reservations-repository";

export class ReservationsService {
    static async findAll(query: ReservationWhereQuery) {
        return await ReservationsRepository.findAll(query);
    }

    static async findById(id: string) {
        return await ReservationsRepository.findById(id);
    }

    static async create(reservation: CreateReservationDto) {
        const existentReservations = await ReservationsRepository.findAll({
            resource_id: reservation.resource_id,
            class_id: reservation.class_id,
        });
        const existentReservation = existentReservations?.[0];
        if (existentReservation) throw new ReservationConflictError(existentReservation);
        const id = await ReservationsRepository.create(reservation);
        return await ReservationsRepository.findById(id);
    }

    static async update(reservation: UpdateReservationDto) {
        const existentReservation = await ReservationsRepository.findById(reservation.id);
        if (!existentReservation) return;
        const resource_id = reservation.resource_id ?? existentReservation.resource_id;
        const class_id = reservation.class_id ?? existentReservation.class_id;
        const conflictReservations = await ReservationsRepository.findAll({ resource_id, class_id });
        const conflictReservation = conflictReservations[0];
        if (conflictReservation) throw new ReservationConflictError(conflictReservation);
        await ReservationsRepository.update(reservation);
        return await ReservationsRepository.findById(reservation.id);
    }
}
