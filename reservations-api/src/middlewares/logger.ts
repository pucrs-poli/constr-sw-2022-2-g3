import { Express } from "express";
import morgan from "morgan";

export function RegisterLogger(app: Express) {
    app.use(morgan("tiny"));
}
