import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as mongoose from 'mongoose';
import * as logger from 'morgan';

import { FileManagerController } from './controllers/file-manager.controller';
import { CloudService } from './services/cloud.service';
import Types from './types';

@injectable()
export class Application {
    private readonly internalError: number = 500;
    app: express.Application;

    constructor(
        @inject(Types.FileManagerController) private fileManagerController: FileManagerController,
        @inject(Types.CloudService) private cloudService: CloudService,
    ) {
        this.app = express();
        this.config();
        this.bindRoutes();
        this.cloudService.initialize();
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    bindRoutes(): void {
        // Notre application utilise le routeur de notre API `Index`
        this.app.use('/api/file-manager', this.fileManagerController.router);
        this.errorHandling();

        mongoose
            .connect('mongodb+srv://P9_client:p9123@p9-mgkks.gcp.mongodb.net/dev?retryWrites=true&w=majority', {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useFindAndModify: false,
            })
            .then(() => {
                console.log('Connected to BD!');
            })
            .catch((err: Error) => {
                console.log(err, 'fuck');
            });
    }

    private errorHandling(): void {
        // When previous handlers have not served a request: path wasn't found
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error('Not Found');
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            // tslint:disable-next-line:no-any
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        // tslint:disable-next-line:no-any
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
