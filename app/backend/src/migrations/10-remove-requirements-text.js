'use strict';

module.exports = {  up: async (queryInterface, Sequelize) => {
    try {
      // Check if the table exists first
      const tables = await queryInterface.showAllTables();
      if (!tables.includes('classes')) {
        console.log('Classes table does not exist yet, skipping migration');
        return;
      }
      
      // Check if requirements column exists before trying to remove it
      const tableInfo = await queryInterface.describeTable('classes');
      if (tableInfo.requirements) {
        await queryInterface.removeColumn('classes', 'requirements');
        console.log('Successfully removed requirements column from classes table');
      } else {
        console.log('Requirements column does not exist in classes table, skipping');
      }
    } catch (error) {
      console.error('Migration error:', error);
      // Don't throw error if table doesn't exist - just skip this migration
      if (error.message.includes('No description found')) {
        console.log('Skipping migration - table does not exist yet');
        return;
      }
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
