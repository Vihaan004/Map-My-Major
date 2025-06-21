'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('classes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      credits: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      requirements: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      prerequisites: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      corequisites: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      semesterId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Semesters',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('classes');
  }
};
