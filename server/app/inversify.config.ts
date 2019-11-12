import { Container } from 'inversify';

import { Application } from './app';
import { FileManagerController } from './controllers/file-manager.controller';
import { Server } from './server';
import Types from './types';
import { FileManagerService } from './services/file-manager.service';

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.FileManagerController).to(FileManagerController);
container.bind(Types.FileManagerService).to(FileManagerService);

export { container };
