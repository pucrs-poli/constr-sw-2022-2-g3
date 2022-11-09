import { Response } from "superagent";
import chai from "chai";

type CallbackHandler = (err: any, res: Response) => void;

export const devReset = (done: CallbackHandler) => chai.request('http://localhost:3001').post('/dev/reset').end(done);
