import { Body, Controller, Get, Patch, Path, Post, Query, Route, Security, SuccessResponse } from "tsoa";
import { CreateReservationDto, UpdateReservationDto } from "../dtos/reservations";
import { NotFoundError } from "../errors/non-found-error";
import { ReservationsService } from '../services/reservations-service';

@Route('/reservations')
export class ReservationsController extends Controller {

    @Get('/')
    @SuccessResponse('200')
    @Security('api_key', ['coordenadores', 'professores'])
    async findAll() {
        return await ReservationsService.findAll();
    }

    @Get('/:id')
    @SuccessResponse('200')
    @Security('api_key', ['coordenadores', 'professores'])
    async findById(@Path('id') id: string) {
        const reservation = await ReservationsService.findById(id);
        if (!reservation) throw new NotFoundError();
        return reservation;
    }

    @Get('/resource/:resourceId/status')
    @SuccessResponse('200')
    @Security('api_key', ['coordenadores', 'professores'])
    async getByResourceIdAndTime(@Path('resourceId') resourceId: string, @Query('time') time?: number) {
        return await ReservationsService.getResourceStatusByResourceIdAndTime(resourceId, time);
    }

    @Post('/')
    @SuccessResponse('200')
    @Security('api_key', ['coordenadores', 'professores'])
    async create(@Body() body: CreateReservationDto) {
        return await ReservationsService.create(body);
    }

    @Patch('/')
    @SuccessResponse('200')
    @Security('api_key', ['coordenadores', 'professores'])
    async update(@Body() body: UpdateReservationDto) {
        return await ReservationsService.update(body);
    }
}
