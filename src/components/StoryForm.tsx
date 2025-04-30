import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Stack,
  Autocomplete,
} from "@mui/material";
import { StoryFormData } from "../types/story";
import { fetchGenres } from "../api/story";
import UploadThumbnail from "./UploadThumbnail";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const availableTags = ["Magic", "Time Travel", "Space", "War", "Friendship"];

type Props = {
  onSubmit: (data: StoryFormData) => void;
  initialData?: StoryFormData;
};

export default function StoryForm({ onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState<StoryFormData>(
    initialData || {
      title: "",
      genres: [],
      tags: [],
      description: "",
      status: "DRAFT",
    }
  );
  const username = useSelector((state: RootState) => state.auth.user?.username);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  useEffect(() => {
    fetchGenres().then((genres) => {
      setAvailableGenres(genres);
    });
  }, []);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof StoryFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {initialData ? "Edit Story" : "Create New Story"}
      </Typography>

      <UploadThumbnail userId={username!} onUpload={(url) => setFormData({ ...formData, coverImageUrl: url })}/>

      <TextField
        label="Title"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        fullWidth
        required
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
          <TextField {...params} variant="outlined" label="Genres" placeholder="Select genres" />
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
        required
        sx={{ mb: 4 }}
      />

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" type="submit">
          {initialData ? "Update Story" : "Create Story"}
        </Button>
      </Stack>
    </Box>
  );
}