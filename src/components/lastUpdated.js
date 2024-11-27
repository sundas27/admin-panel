import React from 'react';
import { Typography } from '@mui/material';

const LastUpdated = ({ timestamp, label }) => (
  <Typography variant="caption" color="textSecondary">
    {label}: {timestamp ? new Date(timestamp).toLocaleString() : 'Never'}
  </Typography>
);

export default LastUpdated;
