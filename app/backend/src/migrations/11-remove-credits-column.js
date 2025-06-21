'use strict';

module.exports = {  up: async (queryInterface, Sequelize) => {
    try {
      // Check if the table exists first
      const tables = await queryInterface.showAllTables();
      if (!tables.includes('classes')) {
        console.log('Classes table does not exist yet, skipping migration');
        return;
      }
      
      // Check if credits column exists before trying to remove it
      const tableInfo = await queryInterface.describeTable('classes');
      if (tableInfo.credits) {
        await queryInterface.removeColumn('classes', 'credits');
        console.log('Successfully removed credits column from classes table');
      } else {
        console.log('Credits column does not exist in classes table, skipping');
      }
    } catch (error) {
      console.error('Migration error:', error);
      if (error.message.includes('No description found')) {
        console.log('Skipping migration - table does not exist yet');
        return;
      }
      throw error;
    }
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
