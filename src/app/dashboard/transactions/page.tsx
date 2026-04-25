'use client';

import NewTransactionFormDialog from '@/components/dashboard/transactions/AddTansactionModal';
import TransactionsTable from '@/components/dashboard/transactions/TransactionsTable';
import TransactionsToolbar from '@/components/dashboard/transactions/TransactionsToolbar';
import type { Transaction } from '@/components/dashboard/transactions/types';
import { Box, Card, Typography, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { useData } from '@/context/DataContent';

export default function TransactionsPage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { categories, refreshTransactions, isLoading } = useData();

  const handleOpenAdd = () => {
    setTransactionToEdit(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setDialogOpen(true);
  };

  const handleRequestDelete = (idsToDelete: number[]) => {
    setSelectedIds(idsToDelete);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSelected = async () => {
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .in('id', selectedIds);

      if (error) throw error;

      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedIds([]);
      refreshTransactions();

      // TODO: Add a success toast/snackbar here!
    } catch (error) {
      console.error('Error deleting transactions:', error);
      // TODO: Add an error toast/snackbar here so the user knows it failed!
      alert('Failed to delete transactions. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <NewTransactionFormDialog
        open={dialogOpen}
        transactionToEdit={transactionToEdit}
        onClose={() => setDialogOpen(false)}
        onSuccess={async () => {
          setPage(1);
          await refreshTransactions();
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
          categories={categories}
          onDeleteSelected={() => handleRequestDelete(selectedIds)}
          onOpenDialog={() => {
            handleOpenAdd();
          }}
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
            selectedIds={selectedIds}
            page={page}
            setPage={setPage}
            searchInput={searchInput}
            onRequestDelete={handleRequestDelete}
            onOpenEdit={handleOpenEdit}
            setSelectedIds={setSelectedIds}
          />
        )}
        <ConfirmDialog
          open={isDeleteDialogOpen}
          title='Delete Transactions'
          message={`Are you sure you want to delete ${selectedIds.length} transaction(s)? This cannot be undone.`}
          confirmText='Delete'
          isPending={isDeleting}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteSelected}
        />
      </Card>
    </>
  );
}
