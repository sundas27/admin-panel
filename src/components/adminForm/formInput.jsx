import React from "react";
import { TextField, Box } from "@mui/material";
import LastUpdated from "../lastUpdated";

const FormInput = ({ label, value, onChange, disabled, lastUpdated, multiline = false, rows }) => (
  <Box sx={{ mb: 3 }}>
    <TextField
      label={label}
      fullWidth
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      sx={{ mb: 1 }}
    />
    {lastUpdated && <LastUpdated timestamp={lastUpdated} label={`${label} Last Updated`} />}
  </Box>
);

export default FormInput;
