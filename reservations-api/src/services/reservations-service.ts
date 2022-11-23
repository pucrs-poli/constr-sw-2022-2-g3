import { CreateReservationDto, ReservationDto, UpdateReservationDto } from "../dtos/reservations";
import { NotFoundError } from "../errors/non-found-error";
import { ReservationConflictError } from "../errors/resource-conflict-error";
import { Reservation } from "../models/reservations";
import { ReservationsRepository, ReservationWhereQuery } from "../repositories/reservations-repository";
import { ResourcesService } from "./resources-service";

export class ReservationsService {
    private static async mapToDto(token: string, reservation: Reservation): Promise<ReservationDto> {
        const resource = await ResourcesService.getById(token, reservation.resource_id);
        return { ...reservation, resource };
    }

    static async findAll(token: string, query: ReservationWhereQuery): Promise<ReservationDto[]> {
        const reservations = await ReservationsRepository.findAll(query);
        return await Promise.all(reservations.map(reservation => this.mapToDto(token, reservation)));
    }

    static async findById(token: string, id: string): Promise<ReservationDto> {
        const reservation = await ReservationsRepository.findById(id);
        return await this.mapToDto(token, reservation);
    }

    static async create(token: string, reservation: CreateReservationDto): Promise<ReservationDto> {
        const existentReservations = await ReservationsRepository.findAll({
            resource_id: reservation.resource_id,
            class_id: reservation.class_id,
        });
        const existentReservation = existentReservations?.[0];
        if (existentReservation) throw new ReservationConflictError(existentReservation);
        const id = await ReservationsRepository.create(reservation);
        return await this.findById(token, id);
    }

    static async update(token: string, reservation: UpdateReservationDto): Promise<ReservationDto | undefined> {
        const existentReservation = await ReservationsRepository.findById(reservation.id);
        if (!existentReservation) return;
        const resource_id = reservation.resource_id ?? existentReservation.resource_id;
        const class_id = reservation.class_id ?? existentReservation.class_id;
        const conflictReservations = await ReservationsRepository.findAll({ resource_id, class_id });
        const conflictReservation = conflictReservations[0];
        if (conflictReservation) throw new ReservationConflictError(conflictReservation);
        await ReservationsRepository.update(reservation);
        return await this.findById(token, reservation.id);
    }

    static async deleteById(id: string) {
        const existentReservation = await ReservationsRepository.findById(id);
        if (!existentReservation) throw new NotFoundError();
        await ReservationsRepository.deleteById(id);
    }
}
