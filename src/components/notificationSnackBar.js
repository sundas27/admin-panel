import React from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert"; // To display the Snackbar as an alert

// Define the props for the Snackbar component
const NotificationSnackbar = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000} // Duration of Snackbar visibility
      onClose={onClose}
    >
      <MuiAlert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
