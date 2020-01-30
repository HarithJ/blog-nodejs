'use strict';
module.exports = (sequelize, DataTypes) => {
  const blog = sequelize.define('blog', {
    uuid: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    body: DataTypes.TEXT,
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {});
  blog.associate = function(models) {
    // associations can be defined here
  };
  return blog;
};
