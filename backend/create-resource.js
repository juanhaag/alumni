#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { Command } = require("commander");
const ejs = require("ejs");
const { execSync } = require("child_process");

const program = new Command();

program
  .argument("<resource>", "Nombre del recurso en singular (ej: User)")
  .action(async (resource) => {
    try {
      await generateBackend(resource);
      await generateFrontend(resource);
      console.log(`✅ Recurso '${resource}' generado exitosamente`);
      console.log('🚀 Ejecuta npx sequelize-cli db:migrate');
      
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  });

// 1. Generar archivos backend
async function generateBackend(resource) {
  const backendDir = path.join(__dirname, "../backend");
  const templateDir = path.join(__dirname, "templates/backend");

  // Crear carpetas si no existen
  const folders = ["models", "controllers", "routes", "migrations"];
  folders.forEach((folder) => {
    const dir = path.join(backendDir, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // Crear modelo
  const modelTemplate = fs.readFileSync(
    path.join(templateDir, "model.ejs"),
    "utf-8"
  );
  fs.writeFileSync(
    path.join(backendDir, `models/${resource}.js`),
    ejs.render(modelTemplate, { resource })
  );

  // Crear controlador
  const controllerTemplate = fs.readFileSync(
    path.join(templateDir, "controller.ejs"),
    "utf-8"
  );
  fs.writeFileSync(
    path.join(backendDir, `controllers/${resource}Controller.js`),
    ejs.render(controllerTemplate, { resource })
  );

  // Crear rutas
  const routesTemplate = fs.readFileSync(
    path.join(templateDir, "routes.ejs"),
    "utf-8"
  );
  fs.writeFileSync(
    path.join(backendDir, `routes/${resource}Routes.js`),
    ejs.render(routesTemplate, { resource })
  );

  // Registrar rutas en routes/index.js
  const routesIndexPath = path.join(backendDir, "routes/index.js");
  let routesIndexContent = "";

  // Si el archivo no existe, crearlo
  if (!fs.existsSync(routesIndexPath)) {
    routesIndexContent = `
const fs = require("fs");
const path = require("path");
const express = require("express");

module.exports = (app) => {
  fs.readdirSync(__dirname)
    .filter((file) => file !== "index.js" && file.endsWith("Routes.js"))
    .forEach((file) => {
      const route = require(path.join(__dirname, file));
      const resource = file.replace("Routes.js", "").toLowerCase();
      app.use(\`/api/\${resource}s\`, route);
    });
};
`;
  } else {
    routesIndexContent = fs.readFileSync(routesIndexPath, "utf-8");

    // Verificar si ya existe la lógica dinámica
    if (!routesIndexContent.includes("fs.readdirSync(__dirname)")) {
      routesIndexContent = `
const fs = require("fs");
const path = require("path");
const express = require("express");

module.exports = (app) => {
  fs.readdirSync(__dirname)
    .filter((file) => file !== "index.js" && file.endsWith("Routes.js"))
    .forEach((file) => {
      const route = require(path.join(__dirname, file));
      const resource = file.replace("Routes.js", "").toLowerCase();
      app.use(\`/api/\${resource}s\`, route);
    });
};
`;
    }
  }

  fs.writeFileSync(routesIndexPath, routesIndexContent);

  // Generar migración con los campos que tiene el modelo
  const migrationName = `${new Date().toISOString().replace(/[-:.]/g, "")}-create-${resource.toLowerCase()}`;
  const migrationPath = path.join(backendDir, `migrations/${migrationName}.js`);

  const migrationTemplate = `
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("${resource}s", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("${resource}s");
  },
};
`;

  fs.writeFileSync(migrationPath, migrationTemplate);

  console.log(`✅ Migración generada: ${migrationName}`);
}

// 2. Generar archivos frontend
async function generateFrontend(resource) {
  const frontendDir = path.join(__dirname, "../frontend/src");
  const templateDir = path.join(__dirname, "templates/frontend");

  // Crear carpeta services si no existe
  const servicesDir = path.join(frontendDir, "services");
  if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir, { recursive: true });

  // Crear archivo api.js si no existe
  const apiPath = path.join(servicesDir, "api.js");
  if (!fs.existsSync(apiPath)) {
    fs.writeFileSync(
      apiPath,
      `
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default api;
`
    );
  }

  // Crear componentes
  const componentDir = path.join(frontendDir, `pages/${resource}`);
  fs.mkdirSync(componentDir, { recursive: true });

  ["List", "Create", "Edit", "View"].forEach((template) => {
    const content = fs.readFileSync(
      path.join(templateDir, `${template}.ejs`),
      "utf-8"
    );
    fs.writeFileSync(
      path.join(componentDir, `${template}.jsx`),
      ejs.render(content, { resource })
    );
  });

  // Registrar en routeRegistry.js
  const registryPath = path.join(frontendDir, "routeRegistry.js");
  let registryContent = "";

  // Si el archivo no existe, crearlo
  if (!fs.existsSync(registryPath)) {
    registryContent = `
// frontend/src/routeRegistry.js
import React from "react";

export const routeRegistry = {};
export const resources = [];
`;
  } else {
    registryContent = fs.readFileSync(registryPath, "utf-8");
  }

  // Agregar importaciones NO FUNCIONA ACA!!!!!
  const importStatements = `
import ${resource}List from "./pages/${resource}/List";
import ${resource}Create from "./pages/${resource}/Create";
import ${resource}Edit from "./pages/${resource}/Edit";
import ${resource}View from "./pages/${resource}/View";
`;

  if (!registryContent.includes(`import ${resource}List`)) {
    registryContent = registryContent.replace(
      /export const routeRegistry = {/,
      `${importStatements}\nexport const routeRegistry = {`
    );
  }

  const registryEntries = `
  ${resource}List,
  ${resource}Create,
  ${resource}Edit,
  ${resource}View,
`;

  if (!registryContent.includes(`${resource}List`)) {
    registryContent = registryContent.replace(
      "export const routeRegistry = {",
      `export const routeRegistry = {\n${registryEntries}`
    );
  }
  //NO ANDAA
  const resourceEntry = `{ name: "${resource}s", path: "/${resource.toLowerCase()}s" },`;
  if (!registryContent.includes(`"${resource}s"`)) {
    registryContent = registryContent.replace(
      /export const resources = \[/,
      `export const resources = [\n  ${resourceEntry}`
    );
  }

  fs.writeFileSync(registryPath, registryContent);
}

program.parse(process.argv);