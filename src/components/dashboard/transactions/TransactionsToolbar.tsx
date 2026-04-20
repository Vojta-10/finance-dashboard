import { Add, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';

interface TransactionsToolbarProps {
  selectedCount: number;
  filterCategory: string;
  categories: string[];
  onDeleteSelected: (idsToDelete: number[]) => void;
  onFilterChange: (category: string) => void;
  onOpenDialog: () => void;
  selectedIds: number[];
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchInput: string;
}

export default function TransactionsToolbar({
  selectedCount,
  filterCategory,
  categories,
  onDeleteSelected,
  onFilterChange,
  onOpenDialog,
  selectedIds,
  onSearchChange,
  searchInput,
}: TransactionsToolbarProps) {
  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
      }}
    >
      <TextField
        variant='outlined'
        label='Search Transactions'
        size='small'
        slotProps={{
          htmlInput: {
            'aria-label': 'Search transactions',
          },
        }}
        value={searchInput}
        onChange={onSearchChange}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip
          title={
            selectedCount > 0
              ? `Delete ${selectedCount} selected`
              : 'Select transactions to delete'
          }
        >
          <span>
            <IconButton
              color='error'
              onClick={() => onDeleteSelected(selectedIds)}
              disabled={selectedCount === 0}
              aria-label='Delete selected transactions'
            >
              <Delete />
            </IconButton>
          </span>
        </Tooltip>

        <FormControl size='small' sx={{ minWidth: 150 }}>
          <InputLabel id='filter-label'>Category</InputLabel>
          <Select
            labelId='filter-label'
            id='filter-select'
            label='Category'
            value={filterCategory}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant='contained'
          color='primary'
          startIcon={<Add />}
          sx={{
            boxShadow: 2,
            whiteSpace: 'nowrap',
            textTransform: 'none',
            fontWeight: 'bold',
          }}
          onClick={onOpenDialog}
        >
          Add New
        </Button>
      </Box>
    </Box>
  );
}
