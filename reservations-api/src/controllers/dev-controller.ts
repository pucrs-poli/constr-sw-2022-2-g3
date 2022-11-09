import { Controller, Post, Route, SuccessResponse } from "tsoa";
import { DevService } from "../services/dev-service";

@Route('/dev')
export class DevController extends Controller {

    @Post('/reset')
    @SuccessResponse('200')
    async reset() {
        return await DevService.reset();
    }
}
