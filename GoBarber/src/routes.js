import { Router } from 'express';
import multer from 'multer';

import auth from './app/middlewares/auth';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// apenas as rotas declaradas após a aplicação do middleware de auth serão validadas
routes.use(auth);
routes.put('/users', UserController.update);
routes.get('/providers', ProviderController.index);

// rota para upload de arquivos passando um arquivo por vez no metodo single pelo campo 'file' no body
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
