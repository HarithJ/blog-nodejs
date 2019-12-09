'use strict';
module.exports = (sequelize, DataTypes) => {
  const blog = sequelize.define('blog', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    body: DataTypes.TEXT,
  }, {});
  blog.associate = function(models) {
    // associations can be defined here
  };
  return blog;
};
