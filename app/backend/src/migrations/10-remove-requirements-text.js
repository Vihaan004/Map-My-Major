'use strict';

module.exports = {  up: async (queryInterface, Sequelize) => {
    try {
      // Check if requirements column exists before trying to remove it
      const tableInfo = await queryInterface.describeTable('classes');
      if (tableInfo.requirements) {
        await queryInterface.removeColumn('classes', 'requirements');
      }
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },
  down: async (queryInterface, Sequelize) => {
    // Add the column back if we need to rollback
    await queryInterface.addColumn('classes', 'requirements', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  }
};
