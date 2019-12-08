import Sequelize, { Model } from 'sequelize';

class User extends Model {
  // metodo que é chamado automaticamente pelo sequelize
  static init(sequelize) {
    // classe pai que extendemos e chamados o metodo init da classe
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      // o sequelize como parametro recebido no static init deve ser passado como segundo parametro do metodo
      {
        sequelize,
      }
    );
  }
}

export default User;
