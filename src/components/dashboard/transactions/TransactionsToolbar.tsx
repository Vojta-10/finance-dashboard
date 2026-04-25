import { Add, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { Category } from '../categories/types';

interface TransactionsToolbarProps {
  selectedCount: number;
  categories: Category[];
  onDeleteSelected: () => void;
  onOpenDialog: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchInput: string;
  filterCategory: string;
  handleFilterChange: (category: string) => void;
}

export default function TransactionsToolbar({
  selectedCount,
  categories,
  onDeleteSelected,
  onOpenDialog,
  onSearchChange,
  searchInput,
  filterCategory,
  handleFilterChange,
}: TransactionsToolbarProps) {
  const expenseCategories = categories.filter((cat) => cat.type === 'Expense');
  const incomeCategories = categories.filter((cat) => cat.type === 'Income');

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
              onClick={onDeleteSelected}
              disabled={selectedCount === 0}
              aria-label='Delete selected transactions'
            >
              <Delete />
            </IconButton>
          </span>
        </Tooltip>

        <FormControl size='small' sx={{ minWidth: 200 }}>
          <InputLabel id='filter-label' shrink>
            Filter by Category
          </InputLabel>
          <Select
            labelId='filter-label'
            id='filter-select'
            label='Filter by Category'
            value={filterCategory}
            onChange={(e) => handleFilterChange(e.target.value)}
            displayEmpty
          >
            <MenuItem value=''>
              <em>All Categories</em>
            </MenuItem>
            <Divider />

            <ListSubheader sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Expense
            </ListSubheader>
            {expenseCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
            <ListSubheader sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Income
            </ListSubheader>
            {incomeCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
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
