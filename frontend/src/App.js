import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { routeRegistry } from "./routeRegistry";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige al dashboard por defecto */}
        <Route path="/" element={<Navigate to="/users" />} />

        {/* Todas las rutas usan el DashboardLayout */}
        {Object.keys(routeRegistry).map((key) => {
          const Component = routeRegistry[key];
          const resource = key.replace("List", "").toLowerCase(); 
          const basePath = `/${resource}s`; 

          // Componentes dinámicos para cada acción
          const CreateComponent = routeRegistry[`${resource.charAt(0).toUpperCase()}${resource.slice(1)}Create`];
          const EditComponent = routeRegistry[`${resource.charAt(0).toUpperCase()}${resource.slice(1)}Edit`];
          const ViewComponent = routeRegistry[`${resource.charAt(0).toUpperCase()}${resource.slice(1)}View`];

          return (
            <>
              {/* Ruta principal (List) */}
              <Route
                key={`${key}-list`}
                path={basePath}
                element={
                  <DashboardLayout>
                    <Component />
                  </DashboardLayout>
                }
              />

              {/* Ruta para crear */}
              <Route
                key={`${key}-create`}
                path={`${basePath}/create`}
                element={
                  <DashboardLayout>
                    <CreateComponent />
                  </DashboardLayout>
                }
              />

              {/* Ruta para editar */}
              <Route
                key={`${key}-edit`}
                path={`${basePath}/:id/edit`}
                element={
                  <DashboardLayout>
                    <EditComponent />
                  </DashboardLayout>
                }
              />

              {/* Ruta para ver detalles */}
              <Route
                key={`${key}-view`}
                path={`${basePath}/:id`}
                element={
                  <DashboardLayout>
                    <ViewComponent />
                  </DashboardLayout>
                }
              />
            </>
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;