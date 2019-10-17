import { NextFunction, Request, Response, Router } from "express";
import { injectable } from "inversify";

@injectable()
export class FileManagerController {
    public router: Router;

    constructor() {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get("/open", async (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            res.json({AILLLLLE: "HELLLOOOOOO P9"});
        });

        this.router.get("/save", (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            res.json({OMG: "IL FAUT SAVEEEEE"});
        });
    }
}
