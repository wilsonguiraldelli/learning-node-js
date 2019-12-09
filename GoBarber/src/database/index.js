import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';

const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  // fazer a conexão com a base de dados e carregar as models
  init() {
    // instanciando uma variavel que fara a conexão com o banco de dados de acordo com o arquivo de conexão
    this.connection = new Sequelize(databaseConfig);

    // acessando o metodo init de cada model e realizando a conexão
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
