'use client';

import NewTransactionFormDialog from '@/components/dashboard/transactions/AddTansactionModal';
import TransactionsTable from '@/components/dashboard/transactions/TransactionsTable';
import TransactionsToolbar from '@/components/dashboard/transactions/TransactionsToolbar';
import type { Transaction } from '@/components/dashboard/transactions/types';
import { Box, Card, Typography, CircularProgress } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import type { Category } from '@/components/dashboard/categories/types';

export default function TransactionsPage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [orderBy, setOrderBy] = useState<string>('date');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
  const [categories, setCategories] = useState<Category[]>([]);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleRequestSort = (field: string) => {
    const isAsc = orderBy === field && orderDirection === 'asc';
    setOrderBy(field);
    setOrderDirection(isAsc ? 'desc' : 'asc');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data) setCategories(data);
  }, [supabase]);

  const fetchTransactions = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('No user found');
      setIsLoading(false);
      return;
    }

    let query = supabase
      .from('transactions')
      .select('*, categories (name, color)')
      .eq('user_id', user.id);

    if (debouncedSearch) {
      query = query.ilike('note', `%${debouncedSearch}%`);
    }

    if (filterCategory) {
      query = query.eq('category_id', filterCategory.trim());
    }

    const { data, error } = await query
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data || []);
    }
    setIsLoading(false);
  }, [supabase, debouncedSearch, orderBy, orderDirection, filterCategory]);

  useEffect(() => {
    const loadData = async () => {
      await fetchTransactions();
      await fetchCategories();
    };
    loadData();
  }, [fetchTransactions, fetchCategories, filterCategory]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenMenu(false);
  };

  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  const handleSelectAllClick = (checked: boolean) => {
    if (checked) {
      const newSelecteds = paginatedTransactions.map((n) => n.id);
      setSelectedIds(newSelecteds);
      return;
    }
    setSelectedIds([]);
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

  const handleOpenAdd = () => {
    setTransactionToEdit(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setDialogOpen(true);
  };

  const triggerDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSelected = async (idsToDelete: number[]) => {
    // 1. The Confirmation Guard
    // Prevents accidental clicks from wiping out data instantly
    setIsDeleteDialogOpen(true);
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .in('id', idsToDelete);

      if (error) throw error;

      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedIds([]);
      fetchTransactions();

      // TODO: Add a success toast/snackbar here!
    } catch (error) {
      console.error('Error deleting transactions:', error);
      // TODO: Add an error toast/snackbar here so the user knows it failed!
      alert('Failed to delete transactions. Please try again.');
    }
  };

  const handleFilterChange = (category: string) => {
    setFilterCategory(category);
    setPage(1);
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setPage(1);
  };

  return (
    <>
      <NewTransactionFormDialog
        open={dialogOpen}
        transactionToEdit={transactionToEdit}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => {
          setPage(1);
          fetchTransactions();
        }}
        categories={categories}
      />
      <Card sx={{ mx: 4, p: 3, mt: 2, boxShadow: 1 }}>
        <Typography
          variant='h5'
          fontWeight='bold'
          sx={{ mb: 3 }}
          textAlign='center'
        >
          Recent Transactions
        </Typography>
        <TransactionsToolbar
          selectedCount={selectedIds.length}
          filterCategory={filterCategory}
          categories={categories}
          onDeleteSelected={triggerDelete}
          onFilterChange={handleFilterChange}
          onOpenDialog={() => {
            handleOpenAdd();
          }}
          selectedIds={selectedIds}
          searchInput={searchInput}
          onSearchChange={(e) => setSearchInput(e.target.value)}
        />
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TransactionsTable
            paginatedTransactions={paginatedTransactions}
            selectedIds={selectedIds}
            totalPages={totalPages}
            page={page}
            rowsPerPage={rowsPerPage}
            anchorEl={anchorEl}
            onSelectAllChange={handleSelectAllClick}
            onRowToggle={handleRowClick}
            onOpenRowMenu={handleClick}
            onCloseRowMenu={handleClose}
            openMenu={openMenu}
            onPageChange={setPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            handleDeleteSelected={triggerDelete}
            onOpenEdit={handleOpenEdit}
            setSelectedIds={setSelectedIds}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            orderDirection={orderDirection}
          />
        )}
        <ConfirmDialog
          open={isDeleteDialogOpen}
          title='Delete Transactions'
          message={`Are you sure you want to delete ${selectedIds.length} transaction(s)? This cannot be undone.`}
          confirmText='Delete'
          isPending={isDeleting}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={() => handleDeleteSelected(selectedIds)}
        />
      </Card>
    </>
  );
}
