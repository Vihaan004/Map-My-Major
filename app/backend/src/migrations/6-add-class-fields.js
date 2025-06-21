'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('classes', 'creditHours', {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 3
        }, { transaction: t }),
        queryInterface.addColumn('classes', 'requirementTags', {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: []
        }, { transaction: t })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([        queryInterface.removeColumn('classes', 'creditHours', { transaction: t }),
        queryInterface.removeColumn('classes', 'requirementTags', { transaction: t })
      ]);
    });
  }
};
