import { AuthUser } from "../middlewares/authentication"

declare global {
    namespace Express {
        interface Request {
            user: AuthUser
        }
    }
}
