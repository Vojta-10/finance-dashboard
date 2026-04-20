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
import type { ChipColor, Transaction } from './types';
import ActionMenu from './ActionMenu';

interface TransactionsTableProps {
  paginatedTransactions: Transaction[];
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  categoryColors: Record<string, ChipColor>;
  totalPages: number;
  page: number;
  rowsPerPage: number;
  anchorEl: null | HTMLElement;
  onSelectAllChange: (checked: boolean) => void;
  onRowToggle: (id: number) => void;
  onOpenRowMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCloseRowMenu: () => void;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  openMenu: boolean;
  handleDeleteSelected: (idsToDelete: number[]) => void;
  onOpenEdit: (transaction: Transaction) => void;
  orderBy: string;
  onRequestSort: (field: string) => void;
  orderDirection: 'asc' | 'desc';
}

export default function TransactionsTable({
  paginatedTransactions,
  selectedIds,
  totalPages,
  page,
  rowsPerPage,
  onSelectAllChange,
  onRowToggle,
  onPageChange,
  onRowsPerPageChange,
  handleDeleteSelected,
  onOpenEdit,
  setSelectedIds,
  orderBy,
  onRequestSort,
  orderDirection,
}: TransactionsTableProps) {
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
                  onChange={(event) => onSelectAllChange(event.target.checked)}
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
                  onClick={() => onRequestSort('type')}
                >
                  Type
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '15%' }}>
                <TableSortLabel
                  active={orderBy === 'date'}
                  direction={orderDirection}
                  onClick={() => onRequestSort('date')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '35%' }}>
                <TableSortLabel
                  active={orderBy === 'note'}
                  direction={orderDirection}
                  onClick={() => onRequestSort('note')}
                >
                  Description
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: '25%' }}>Category</TableCell>
              <TableCell sx={{ width: '15%' }}>
                <TableSortLabel
                  active={orderBy === 'amount'}
                  direction={orderDirection}
                  onClick={() => onRequestSort('amount')}
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
                      onChange={() => onRowToggle(tx.id)}
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
                      color={tx.categories?.color || 'default'}
                      size='small'
                      variant='outlined'
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <Typography
                      color={isExpense ? 'error.main' : 'success.main'}
                    >
                      {tx.amount}$
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <ActionMenu
                      transactionId={tx.id}
                      onDelete={() => {
                        setSelectedIds([tx.id]);
                        handleDeleteSelected(selectedIds);
                      }}
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
          onChange={(_, newPage) => onPageChange(newPage)}
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
                onRowsPerPageChange(parseInt(e.target.value, 10))
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
