'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string; // Optional: Defaults to "Confirm"
  cancelText?: string; // Optional: Defaults to "Cancel"
  isPending?: boolean; // Optional: Shows a spinner on the confirm button
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onCancel}
      maxWidth='xs'
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={isPending} color='inherit'>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isPending}
          color='error' // Perfect for destructive actions like Delete
          variant='contained'
          disableElevation
          startIcon={
            isPending ? <CircularProgress size={20} color='inherit' /> : null
          }
        >
          {isPending ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
