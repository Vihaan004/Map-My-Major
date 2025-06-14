'use strict';
module.exports = (sequelize, DataTypes) => {  const Semester = sequelize.define('Semester', {
    index: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'New Sem'
    }
  }, {});
  Semester.associate = function(models) {
    Semester.belongsTo(models.Map, { as: 'map', foreignKey: 'mapId' });
    Semester.hasMany(models.Class, { as: 'classes', foreignKey: 'semesterId' });
  };
  return Semester;
};
