import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import LastUpdated from "./lastUpdated";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import NotificationSnackbar from "./notificationSnackBar"; // Import the Snackbar component

const AdminForm = () => {
  const [content, setContent] = useState({
    title: "",
    description: "",
    titleUpdatedAt: null,
    descriptionUpdatedAt: null,
  });
  const [localContent, setLocalContent] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase.from("content").select("*").single();
      if (error) throw error;
      setContent(data);
      setLocalContent({ title: data?.title, description: data?.description });
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setLocalContent((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = async () => {
    setLoading(true);
    try {
      const updates = {
        id: content.id,
        title: localContent.title,
        description: localContent.description,
        titleUpdatedAt: new Date().toISOString(),
        descriptionUpdatedAt: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("content")
        .update(updates)
        .eq("id", content.id);

      if (error) throw error;

      // Sync changes with content state after successful update
      setContent(updates);

      // Show success notification
      setSnackbarMessage("Content updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating content:", error);

      // Show error notification
      setSnackbarMessage("Failed to update content. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box component={Paper} elevation={3} sx={{ p: 4, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Manage Content
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Title"
          fullWidth
          value={localContent.title || ""}
          onChange={(e) => handleInputChange("title", e.target.value)}
          disabled={loading}
          sx={{ mb: 1 }}
        />
        <LastUpdated timestamp={content.titleUpdatedAt} label="Title Last Updated" />
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={localContent.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          disabled={loading}
          sx={{ mb: 1 }}
        />
        <LastUpdated timestamp={content.descriptionUpdatedAt} label="Description Last Updated" />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={saveChanges}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        Save Changes
      </Button>

      {/* Snackbar component for notifications */}
      <NotificationSnackbar
        open={openSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default AdminForm;
