'use strict';
module.exports = (sequelize, DataTypes) => {
  const Map = sequelize.define('Map', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Map.associate = function(models) {
    Map.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    Map.hasMany(models.Semester, { as: 'semesters', foreignKey: 'mapId' });
  };
  return Map;
};
