import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  Stack
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { saveThumbnail } from '../api/images';

interface UploadThumbnailProps {
  userId: string;
  onUpload: (url: string) => void;
}

const UploadThumbnail: React.FC<UploadThumbnailProps> = ({ userId, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    try {
      const data = await saveThumbnail(formData);
      onUpload(data.url);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileIcon />}
          disabled={uploading}
        >
          Upload Thumbnail
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>
        {uploading && <CircularProgress size={24} />}
        {selectedFileName && !uploading && (
          <Typography variant="body2" color="textSecondary">
            {selectedFileName}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default UploadThumbnail;