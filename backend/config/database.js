const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("alumni", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL establecida correctamente.");
  } catch (error) {
    console.error("❌ Error al conectar a MySQL:", error);
  }
})();

module.exports = sequelize;