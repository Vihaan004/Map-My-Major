'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('classes', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'planned'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('classes', 'status');
  }
};
