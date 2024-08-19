const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const User = require("./User");

const Thought = db.define("Thought", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
});

// Relacionamento de Tabelas no DB
Thought.belongsTo(User); // Pensamento(s) pertence(m) a usuário(s)
User.hasMany(Thought); //Um Usuário possuí vários pensamentos (Toughts)

module.exports = Thought;
