'use strict';
module.exports = (sequelize, DataTypes) => {  const Class = sequelize.define('Class', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },    creditHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    requirementTags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    prerequisites: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    corequisites: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'planned',
      validate: {
        isIn: [['planned', 'in-progress', 'complete']]
      }
    }
  }, {});
  Class.associate = function(models) {
    Class.belongsTo(models.Semester, { as: 'semester', foreignKey: 'semesterId' });
  };
  return Class;
};
