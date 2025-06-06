'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // First check if name column already exists
      const tableInfo = await queryInterface.describeTable('Requirements');
      if (!tableInfo.name) {
        // Add name column
        await queryInterface.addColumn('Requirements', 'name', {
          type: Sequelize.STRING,
          allowNull: true
        });

        // Update existing records to use tag as name
        await queryInterface.sequelize.query(`
          UPDATE "Requirements" SET "name" = "tag" WHERE "name" IS NULL
        `);

        // Make name not nullable
        await queryInterface.changeColumn('Requirements', 'name', {
          type: Sequelize.STRING,
          allowNull: false
        });
      }
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Check if the column exists before trying to remove it
      const tableInfo = await queryInterface.describeTable('Requirements');
      if (tableInfo.name) {
        await queryInterface.removeColumn('Requirements', 'name');
      }
    } catch (error) {
      console.error('Migration rollback error:', error);
      throw error;
    }
  }
};
