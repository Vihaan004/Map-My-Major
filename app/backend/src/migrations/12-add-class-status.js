'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Classes', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'planned'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Classes', 'status');
  }
};
