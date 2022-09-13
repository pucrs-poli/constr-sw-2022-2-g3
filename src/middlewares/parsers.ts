import { Express, json, urlencoded } from "express";

export function RegisterParsers(app: Express) {
    app.use(json());
    app.use(urlencoded({ extended: true }));
}
