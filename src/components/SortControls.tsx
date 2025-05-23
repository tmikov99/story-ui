import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { Box, FormControl, Select, MenuItem, IconButton, Tooltip, ListItemIcon, ListItemText } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TitleIcon from '@mui/icons-material/Title';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

interface SortControlsProps {
  sortField: string;
  sortOrder: string;
  onSortFieldChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
}

export default function SortControls({ sortField, sortOrder, onSortFieldChange, onSortOrderChange }: SortControlsProps) {
  const isAscending = sortOrder === 'asc';

  return (
    <Box display="flex" gap={2} mb={2}>
      <FormControl size="small" sx={{ minWidth: 186 }}>
        <Select
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value)}
          renderValue={(selected) => {
            const iconMap: Record<string, JSX.Element> = {
              createdAt: <AccessTimeIcon fontSize="small" />,
              reads: <VisibilityIcon fontSize="small" />,
              likes: <ThumbUpAltIcon fontSize="small" />,
              title: <TitleIcon fontSize="small" />,
            };
        
            const labelMap: Record<string, string> = {
              createdAt: isAscending ? "Oldest" : "Latest",
              reads: isAscending ? "Least Read" : "Most Read",
              likes: isAscending ? "Least Liked" : "Most Liked",
              title: "Alphabetical",
            };
        
            return (
              <Box display="flex" alignItems="center" gap={1}>
                {iconMap[selected]}
                {labelMap[selected]}
              </Box>
            );
          }}
        >
          <MenuItem value="createdAt">
            <ListItemIcon>
              <AccessTimeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={isAscending ? "Oldest" : "Latest"} />
          </MenuItem>
          <MenuItem value="reads">
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={isAscending ? "Least Read" : "Most Read"} />
          </MenuItem>
          <MenuItem value="likes">
            <ListItemIcon>
              <ThumbUpAltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={isAscending ? "Least Liked" : "Most Liked"} />
          </MenuItem>
          <MenuItem value="title">
            <ListItemIcon>
              <TitleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Alphabetical" />
          </MenuItem>
        </Select>
      </FormControl>
      
      <Tooltip title={isAscending ? 'Ascending' : 'Descending'}>
        <IconButton
          onClick={() => onSortOrderChange(isAscending ? 'desc' : 'asc')}
          size="small"
          sx={{ border: '1px solid #ccc', borderRadius: 1 }}
        >
          {isAscending ? <ArrowUpward /> : <ArrowDownward />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}