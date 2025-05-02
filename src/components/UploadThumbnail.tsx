import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Stack
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface UploadThumbnailProps {
  onFileSelect: (file: File) => void;
}

const UploadThumbnail: React.FC<UploadThumbnailProps> = ({ onFileSelect }) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);
    onFileSelect(file);  // Pass the file up
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileIcon />}
        >
          Upload Thumbnail
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>
        {selectedFileName && (
          <Typography variant="body2" color="textSecondary">
            {selectedFileName}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default UploadThumbnail;