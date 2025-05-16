import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Stack,
  Autocomplete,
  Alert,
} from "@mui/material";
import { StoryFormData } from "../../types/story";
import { fetchGenres } from "../../api/story";
import UploadThumbnail from "./UploadThumbnail";

const availableTags = ["Magic", "Time Travel", "Space", "War", "Friendship"];

type Props = {
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  initialData?: StoryFormData;
  error?: string | null;
};

export default function StoryForm({ onSubmit, onCancel, initialData, error }: Props) {
  const [formData, setFormData] = useState<StoryFormData>(
    initialData || {
      title: "",
      genres: [],
      tags: [],
      description: "",
      status: "DRAFT",
    }
  );
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData?.coverImageUrl) {
      setImagePreview(initialData.coverImageUrl);
    }
  }, [initialData]);

  useEffect(() => {
    if (thumbnailFile) {
      const objectUrl = URL.createObjectURL(thumbnailFile);
      setImagePreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // Cleanup
    }
  }, [thumbnailFile]);


  useEffect(() => {
    fetchGenres().then((genres) => {
      setAvailableGenres(genres);
    });
  }, []);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.trim() === "") {
      newErrors.title = "Title is required.";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters.";
    }

    if (!formData.genres || formData.genres.length === 0) {
      newErrors.genres = "Please select at least one genre.";
    }

    if (!formData.description || formData.description.trim() === "") {
      newErrors.description = "Description is required.";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description must be less than 100 characters.";
    }

    return newErrors;
  };

  const handleChange = (field: keyof StoryFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    setErrors((prevErrors) => {
      const { [field]: _, ...rest } = prevErrors;
      return rest;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("1")
    e.preventDefault();
    console.log("2")
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors({});
    }

    const formPayload = new FormData();
    formPayload.append("story", new Blob([JSON.stringify({ ...formData })], { type: "application/json" }));
    if (thumbnailFile) {
      formPayload.append("file", thumbnailFile);
    }
  
    onSubmit(formPayload);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {initialData ? "Edit Story" : "Create New Story"}
      </Typography>
      {error && (
        <Box mb={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <UploadThumbnail onFileSelect={(file) => setThumbnailFile(file)} />
      {imagePreview && (
        <Box mb={2}>
          <img src={imagePreview} alt="Thumbnail preview" style={{ maxWidth: "100%", borderRadius: 8 }} />
        </Box>
      )}

      <TextField
        label="Title"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        fullWidth
        error={!!errors.title}
        helperText={errors.title}
        sx={{ mb: 3 }}
      />

      <Autocomplete
        multiple
        options={availableGenres}
        value={formData.genres}
        onChange={(_, value) => handleChange("genres", value)}
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
          ))
        }
        renderInput={(params) => (
          <TextField 
            {...params} 
            variant="outlined" 
            label="Genres" 
            placeholder="Select genres" 
            error={!!errors.genres}
            helperText={errors.genres}
          />
        )}
        sx={{ mb: 3 }}
      />

      <Autocomplete
        multiple
        freeSolo
        options={availableTags}
        value={formData.tags}
        onChange={(_, value) => handleChange("tags", value)}
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Tags" placeholder="Add or select tags" />
        )}
        sx={{ mb: 3 }}
      />

      <TextField
        label="Description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        multiline
        minRows={4}
        fullWidth
        error={!!errors.description}
        helperText={errors.description}
        sx={{ mb: 4 }}
      />

      <Stack direction="row" justifyContent="space-between">
        <Button variant="outlined" color="error" onClick={onCancel}>Cancel</Button>
        <Button variant="contained" type="submit" disabled={Object.keys(errors).length > 0}>
          {initialData ? "Update Story" : "Create Story"}
        </Button>
      </Stack>
    </Box>
  );
}