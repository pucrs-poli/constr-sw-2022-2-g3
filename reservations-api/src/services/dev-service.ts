import { ReservationsRepository } from "../repositories/reservations-repository";

export class DevService {
    static async reset() {
        return await ReservationsRepository.reset();
    }
}
