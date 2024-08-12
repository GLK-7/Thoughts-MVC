const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const User = require("../models/User");

const Tought = db.define("Tought", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
});

// Relacionamento de Tabelas no DB
Tought.belongsTo(User); // Pensamento(s) pertence(m) a usuário(s)
User.hasMany(Tought); //Um Usuário possuí vários pensamentos (Toughts)

module.exports = Tought;
