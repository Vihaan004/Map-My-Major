'use strict';
module.exports = {  up: async (queryInterface, Sequelize) => {
    try {
      // Check if the table exists first
      const tables = await queryInterface.showAllTables();
      if (!tables.includes('classes')) {
        console.log('Classes table does not exist yet, skipping migration');
        return;
      }
      
      // Check if status column already exists
      const tableInfo = await queryInterface.describeTable('classes');
      if (!tableInfo.status) {
        await queryInterface.addColumn('classes', 'status', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'planned'
        });
        console.log('Successfully added status column to classes table');
      } else {
        console.log('Status column already exists in classes table, skipping');
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
    await queryInterface.removeColumn('classes', 'status');
  }
};
