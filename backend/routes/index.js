const fs = require("fs");
const path = require("path");

module.exports = (app) => {
  fs.readdirSync(__dirname)
    .filter((file) => file !== "index.js" && file.endsWith("Routes.js"))
    .forEach((file) => {
      const route = require(path.join(__dirname, file));
      const resource = file.replace("Routes.js", "").toLowerCase(); // Extrae el nombre del recurso
      app.use(`/api/${resource}s`, route); // Construye la ruta dinámica
    });
};