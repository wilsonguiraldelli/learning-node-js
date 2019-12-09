module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      // quando atualizar registro na tabela de file, usar efeito cascata para tabela de users
      onUpdate: 'CASCADE',
      // quando deletar, setar como null
      onDelete: 'SET NULL',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
