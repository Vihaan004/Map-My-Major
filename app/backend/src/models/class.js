'use strict';
module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    prerequisites: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    corequisites: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {});
  Class.associate = function(models) {
    Class.belongsTo(models.Semester, { as: 'semester', foreignKey: 'semesterId' });
  };
  return Class;
};
