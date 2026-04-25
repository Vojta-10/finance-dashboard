import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  NativeSelect,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Transaction } from './types';
import ActionMenu from './ActionMenu';
import { formatCurrency } from '@/utils/utils';
import { useData } from '@/context/DataContent';
import { useState } from 'react';

interface TransactionsTableProps {
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  setPage: (page: number) => void;
  onRequestDelete: (idsToDelete: number[]) => void;
  onOpenEdit: (transaction: Transaction) => void;
  searchInput: string;
  page: number;
  filterCategory: string;
}

export default function TransactionsTable({
  selectedIds,
  page,
  setPage,
  onRequestDelete,
  onOpenEdit,
  setSelectedIds,
  searchInput,
  filterCategory,
}: TransactionsTableProps) {
  const { transactions } = useData();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<string>('date');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');

  const handleRequestSort = (field: string) => {
    const isAsc = orderBy === field && orderDirection === 'asc';
    setOrderBy(field);
    setOrderDirection(isAsc ? 'desc' : 'asc');
  };

  let filteredTransactions = transactions.filter((tx) => {
    if (!searchInput) return true;
    if (!tx.note) return false;

    return tx.note.toLowerCase().includes(searchInput.toLowerCase());
  });

  if (filterCategory) {
    filteredTransactions = filteredTransactions.filter(
      (tx) => tx.category_id === filterCategory,
    );
  }

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    endIndex,
  );

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = paginatedTransactions.map((n) => n.id);
      setSelectedIds(newSelecteds);
      return;
    }
    setSelectedIds([]);
  };

  const resolveCategoryColor = (value: string | undefined) => {
    if (value && /^#[0-9A-Fa-f]{6}$/.test(value)) {
      return value;
    }

    return '#9e9e9e';
  };

  const handleRowClick = (id: number) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1),
      );
    }

    setSelectedIds(newSelected);
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setPage(1);
  };

  const formatTableDate = (dateString: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow
              sx={{
                '& .MuiTableCell-root': {
                  color: 'text.primary',
                },
              }}
            >
              <TableCell padding='checkbox'>
                <Checkbox
                  color='primary'
                  checked={
                    paginatedTransactions.length > 0 &&
                    selectedIds.length === paginatedTransactions.length
                  }
                  onChange={(event) =>
                    handleSelectAllClick(event.target.checked)
                  }
                  indeterminate={
                    selectedIds.length > 0 &&
                    selectedIds.length < paginatedTransactions.length
                  }
                  slotProps={{
                    input: {
                      'aria-label': 'Select all visible transactions',
                    },
                  }}
                />
              </TableCell>
              <TableCell sx={{ width: '15%' }}>
                <TableSortLabel
                  active={orderBy === 'type'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('type')}
                >
                  Type
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '15%' }}>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('date')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '35%' }}>
                <TableSortLabel
                  active={orderBy === 'note'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('note')}
                >
                  Description
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '25%' }}>Category</TableCell>
              <TableCell sx={{ width: '15%' }}>
                <TableSortLabel
                  active={orderBy === 'amount'}
                  direction={orderDirection}
                  onClick={() => handleRequestSort('amount')}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell align='right' sx={{ width: 50 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.map((tx) => {
              const isExpense = String(tx.amount).startsWith('-');
              const chipColor = resolveCategoryColor(tx.categories?.color);

              return (
                <TableRow
                  key={tx.id}
                  selected={selectedIds.includes(tx.id)}
                  hover
                >
                  <TableCell padding='checkbox'>
                    <Checkbox
                      color='primary'
                      checked={selectedIds.includes(tx.id)}
                      onChange={() => handleRowClick(tx.id)}
                      slotProps={{
                        input: {
                          'aria-label': `Select transaction ${tx.note}`,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>{isExpense ? 'Expense' : 'Income'}</TableCell>
                  <TableCell>{formatTableDate(tx.date)}</TableCell>
                  <TableCell>{tx.note}</TableCell>
                  <TableCell>
                    <Chip
                      label={tx.categories?.name}
                      size='small'
                      variant='outlined'
                      sx={{
                        fontWeight: 'bold',
                        color: chipColor,
                        borderColor: chipColor,
                        backgroundColor: alpha(chipColor, 0.08),
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <Typography
                      color={isExpense ? 'error.main' : 'success.main'}
                    >
                      {formatCurrency(Number(tx.amount))}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <ActionMenu
                      onDelete={() => onRequestDelete([tx.id])}
                      onEdit={() => onOpenEdit(tx)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          mt: 2,
        }}
      >
        <Box sx={{ flex: 1 }} />

        <Pagination
          color='primary'
          shape='rounded'
          size='small'
          count={totalPages}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          showFirstButton
          showLastButton
        />

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant='body2' color='text.secondary'>
            Rows per page:
          </Typography>

          <FormControl size='small'>
            <NativeSelect
              value={rowsPerPage}
              onChange={(e) =>
                handleRowsPerPageChange(parseInt(e.target.value, 10))
              }
              slotProps={{
                input: {
                  name: 'rows-per-page',
                  id: 'rows-per-page',
                  'aria-label': 'Rows per page',
                },
              }}
              disableUnderline
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </NativeSelect>
          </FormControl>
        </Box>
      </Box>
    </>
  );
}
