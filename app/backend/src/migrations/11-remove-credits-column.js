'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the redundant credits column, keeping creditHours as the standard
    await queryInterface.removeColumn('classes', 'credits');
  },

  down: async (queryInterface, Sequelize) => {
    // Add the credits column back if rollback is needed
    await queryInterface.addColumn('classes', 'credits', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 3
    });
  }
};
