/*
Example model with all possible options (in-progress)

Concepts covered :
- Model Definition
- Field validation
- Class Methods
- Instance Methods
- Associations
*/

let sequelize = require('./index');
let bcrypt = require('bcrypt-nodejs');
let Photo = require('./Photo');

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // Validate a field
      validate: {
        isUnique: function (value, next) {
          var self = this;
          User.find({ where: { username: value } })
            .then(function (user) {
              // reject if a different user wants to use the same username
              if (user && self.id !== user.id) {
                return next('username already in use!');
              }
              return next();
            })
            .catch(function (err) {
              return next(err);
            });
        }
      }
    }
  }, {
      classMethods: {
        generateHash: function (password) {
          return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        },

      },
      instanceMethods: {
        validPassword: function (password) {
          return bcrypt.compareSync(password, this.password);
        }
      }
    });

  User.hasMany(Photo,{as: 'photos', foreignKey: 'userId'})

  return User;
}
