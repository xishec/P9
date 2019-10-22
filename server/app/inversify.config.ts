import { Container } from 'inversify';

import { Application } from './app';
import { Server } from './server';
import { FileManagerController } from './controllers/file-manager.controller';
import Types from './types';

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.FileManagerController).to(FileManagerController);

export { container };
