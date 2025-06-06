'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get list of all tables
    const tables = await queryInterface.showAllTables();
    console.log('Tables in database:', tables);
  },

  async down(queryInterface, Sequelize) {
    // No need to do anything in down migration
  }
};
