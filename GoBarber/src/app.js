import express from 'express';
import path from 'path';
import routes from './routes';

// importando arquivo index.js para que seja executado assim que o projeto for executado, estabelevendo conexão com o banco de dados
import './database';

class App {
  // construtor sempre é executado quando a classe é instanciada/chamada
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    // recebe e transmite em formato json
    this.server.use(express.json());
    // definindo caminho de busca de arquivos
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    );
  }

  routes() {
    // passando as rotas do arquivos de rotas
    this.server.use(routes);
  }
}

// exportando instancia de App
export default new App().server;
