import { Box, CssBaseline, AppBar, Toolbar, Typography, Drawer } from "@mui/material";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Barra superior */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6">Alumni</Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
        }}
      >
        <Toolbar /> {/* Espacio para alinear con la AppBar */}
        <Sidebar />
      </Drawer>

      {/* Contenido principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Espacio para alinear con la AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;