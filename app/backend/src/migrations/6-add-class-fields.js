'use strict';

module.exports = {  up: async (queryInterface, Sequelize) => {
    try {
      // Check if the table exists first
      const tables = await queryInterface.showAllTables();
      if (!tables.includes('classes')) {
        console.log('Classes table does not exist yet, skipping migration');
        return;
      }
      
      return queryInterface.sequelize.transaction(async t => {
        const tableInfo = await queryInterface.describeTable('classes');
        const promises = [];
        
        if (!tableInfo.creditHours) {
          promises.push(
            queryInterface.addColumn('classes', 'creditHours', {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 3
            }, { transaction: t })
          );
        }
        
        if (!tableInfo.requirementTags) {
          promises.push(
            queryInterface.addColumn('classes', 'requirementTags', {
              type: Sequelize.JSON,
              allowNull: true,
              defaultValue: []
            }, { transaction: t })
          );
        }
        
        return Promise.all(promises);
      });
    } catch (error) {
      console.error('Migration error:', error);
      if (error.message.includes('No description found')) {
        console.log('Skipping migration - table does not exist yet');
        return;
      }
      throw error;
    }
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([        queryInterface.removeColumn('classes', 'creditHours', { transaction: t }),
        queryInterface.removeColumn('classes', 'requirementTags', { transaction: t })
      ]);
    });
  }
};
