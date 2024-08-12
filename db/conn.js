const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("toughts", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Conectamos com sucesso!");
} catch (e) {
  console.log(`Não foi possível conectar ao bd: ${e}`);
}

module.exports = sequelize;
