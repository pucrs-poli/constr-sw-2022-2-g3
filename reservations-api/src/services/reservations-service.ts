import { CreateReservationDto } from "../dtos/reservations";
import { ReservationsRepository } from "../repositories/reservations-repository";

export class ReservationsService {
    static async findAll() {
        return await ReservationsRepository.findAll();
    }

    static async findById(id: number) {
        return await ReservationsRepository.findById(id);
    }

    static async create(reservation: CreateReservationDto) {
        const id = await ReservationsRepository.create(reservation);
        return ReservationsRepository.findById(id);
    }
}
