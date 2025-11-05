import 'dotenv/config'

import Repository from './repository/repository';
import Service from './service/service';
import Controller from './controller/controller';
import { startServer } from './router/rotuer';

const repository = new Repository();
const service = new Service(repository);
const controller = new Controller(service);

startServer(controller);

