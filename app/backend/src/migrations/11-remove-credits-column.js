'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the redundant credits column, keeping creditHours as the standard
    await queryInterface.removeColumn('Classes', 'credits');
  },

  down: async (queryInterface, Sequelize) => {
    // Add the credits column back if rollback is needed
    await queryInterface.addColumn('Classes', 'credits', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 3
    });
  }
};
