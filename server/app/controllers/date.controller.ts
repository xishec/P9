import {NextFunction, Request, Response, Router} from 'express';
import {inject, injectable} from 'inversify';
import {Message} from '../../../common/communication/message';
import {DateService} from '../services/date.service';
import Types from '../types';

@injectable()
export class DateController {

    public router: Router;

    constructor(@inject(Types.DateService) private dateService: DateService) {
        this.configureRouter();
    }

    private configureRouter() {
        this.router = Router();
        this.router.get('/',
            (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                this.dateService.currentTime().then((time: Message) => {
                    res.json(time);
                }).catch((reason: unknown) => {
                    const errorMessage: Message = {
                        title: `Error`,
                        body: reason as string,
                    };
                    res.json(errorMessage);
                });
            });
    }
}
