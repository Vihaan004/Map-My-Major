'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Classes', 'creditHours', {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 3
        }, { transaction: t }),
        queryInterface.addColumn('Classes', 'requirementTags', {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: []
        }, { transaction: t })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Classes', 'creditHours', { transaction: t }),
        queryInterface.removeColumn('Classes', 'requirementTags', { transaction: t })
      ]);
    });
  }
};
