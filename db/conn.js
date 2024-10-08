const { Sequelize } = require("sequelize");
require("dotenv/config");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT
  },
);

try {
  sequelize.authenticate();
  console.log("Conectamos com sucesso!");
} catch (e) {
  console.log(`Não foi possível conectar ao bd: ${e}`);
}

module.exports = sequelize;
