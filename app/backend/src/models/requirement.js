'use strict';
module.exports = (sequelize, DataTypes) => {
  const Requirement = sequelize.define('Requirement', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['credits', 'classes']]
      }
    },    goal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    current: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '#007bff'
    }
  }, {});
  Requirement.associate = function(models) {
    Requirement.belongsTo(models.Map, { as: 'map', foreignKey: 'mapId' });
  };
  return Requirement;
};
