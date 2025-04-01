import React from "react";
import { NavLink } from "react-router-dom";
import { List, ListItemButton, ListItemText } from "@mui/material";
import { resources } from "../routeRegistry";

const Sidebar = () => {
  return (
    <List>
      {resources.map((resource) => (
        <ListItemButton
          key={resource.name}
          component={NavLink}
          to={resource.path}
          sx={{
            "&.active": {
              backgroundColor: "rgba(0, 0, 0, 0.08)", 
            },
          }}
        >
          <ListItemText primary={resource.name} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default Sidebar;