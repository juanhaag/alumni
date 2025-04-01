const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const routes = require("./routes");

const app = express();

app.use(cors()); 
app.use(express.json());

routes(app);

(async () => {
  try {
    await sequelize.sync({ force: false }); 
    console.log("✅ Modelos sincronizados con la base de datos.");
  } catch (error) {
    console.error("❌ Error al sincronizar modelos:", error);
  }
})();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});