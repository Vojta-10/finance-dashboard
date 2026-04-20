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
  filterCategory: string;
  categories: Category[];
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
              onClick={() => onDeleteSelected(selectedIds)}
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
            onChange={(e) =>
              onFilterChange(
                categories.find((cat) => cat.id === e.target.value)?.id || '',
              )
            }
            displayEmpty
          >
            <MenuItem value=''>
              <em>All Categories</em>
            </MenuItem>
            <Divider />

            <ListSubheader sx={{ fontWeight: 'bold', color: 'primary.main'}}>
              Expenses
            </ListSubheader>
            {expenseCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
            <ListSubheader sx={{ fontWeight: 'bold', color: 'primary.main'}}>
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
