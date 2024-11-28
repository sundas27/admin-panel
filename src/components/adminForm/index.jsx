import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { fetchContent, updateContent, insertContent } from "../../utils/contentUtils";
import NotificationSnackbar from "../notificationSnackBar";
import FormInput from "./formInput";

const AdminForm = () => {
  const [content, setContent] = useState({
    id: null,
    title: "",
    description: "",
    titleUpdatedAt: null,
    descriptionUpdatedAt: null,
  });
  const [localContent, setLocalContent] = useState({
    id: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await fetchContent();
        if (data && data.id) {
          setContent(data);
          setLocalContent({
            id: data.id,
            title: data.title,
            description: data.description,
          });
        } else {
          setContent({ id: null });
          setLocalContent({ id: "", title: "", description: "" });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to fetch content.",
          severity: "error",
        });
      }
    };
    loadContent();
  }, []);

  const handleInputChange = (field, value) => {
    setLocalContent((prev) => ({
      ...prev,
      [field]: value,
    }));

    setContent((prev) => ({
      ...prev,
      [`${field}UpdatedAt`]: new Date().toISOString(), // Update the respective timestamp
    }));
  };

  const saveChanges = async () => {
    setLoading(true);
    try {
      const updates = {
        ...localContent,
        titleUpdatedAt: content.titleUpdatedAt, // Use the latest timestamp
        descriptionUpdatedAt: content.descriptionUpdatedAt, // Use the latest timestamp
      };

      if (content?.id) {
        await updateContent(content?.id, updates);
        setSnackbar({
          open: true,
          message: "Content updated successfully!",
          severity: "success",
        });
      } else {
        delete updates.id;
        const insertedContent = await insertContent(updates);
        setContent(insertedContent);
        setSnackbar({
          open: true,
          message: "Content inserted successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error(`Error while saving content: ${error}`);
      setSnackbar({
        open: true,
        message: "Failed to save content.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{ p: 4, maxWidth: 600, margin: "auto" }}
    >
      <Typography variant="h5" gutterBottom>
        Manage Content
      </Typography>

      <FormInput
        label="Title"
        value={localContent?.title}
        onChange={(value) => handleInputChange("title", value)}
        disabled={loading}
        lastUpdated={content?.titleUpdatedAt}
      />

      <FormInput
        label="Description"
        value={localContent?.description}
        onChange={(value) => handleInputChange("description", value)}
        disabled={loading}
        lastUpdated={content?.descriptionUpdatedAt}
        multiline
        rows={4}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={saveChanges}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>

      <NotificationSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default AdminForm;
