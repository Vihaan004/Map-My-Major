'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Semesters', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'New Sem'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Semesters', 'name');
  }
};
