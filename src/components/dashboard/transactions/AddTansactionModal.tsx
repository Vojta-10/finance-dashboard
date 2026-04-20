'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  transactionSchema,
  type TransactionFormData,
} from '@/lib/schemas/transaction';
import { supabase } from '@/lib/supabase/client';
import { Transaction } from './types';
import { Category } from '../categories/types';

interface NewTransactionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transactionToEdit?: Transaction | null;
  categories: Category[];
}

export default function NewTransactionFormDialog({
  open,
  onClose,
  onSuccess,
  transactionToEdit,
  categories,
}: NewTransactionFormDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = !!transactionToEdit;
  const modalTitle = isEditing ? 'Edit Transaction' : 'Add Transaction';
  const buttonText = isEditing ? 'Save Changes' : 'Add Transaction';

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'Expense',
      date: new Date(),
      description: '',
      category: '',
      amount: 0,
    },
  });

  const selectedType = useWatch({ control, name: 'type' });

  useEffect(() => {
    if (transactionToEdit) return;
    setValue('category', '');
  }, [selectedType, setValue, transactionToEdit]);

  const categoryOptions = categories.filter((cat) => cat.type === selectedType);

  useEffect(() => {
    if (open && transactionToEdit) {
      console.log(
        'Editing transaction, pre-filling form with:',
        transactionToEdit,
      );
      reset({
        type: Number(transactionToEdit.amount) < 0 ? 'Expense' : 'Income',
        amount: Math.abs(Number(transactionToEdit.amount)),
        description: transactionToEdit.note,

        // THE FIX: Wrap it in String() to satisfy TypeScript and Zod
        category: transactionToEdit.category_id
          ? transactionToEdit.category_id
          : '',

        date: transactionToEdit.date,
      });
    } else if (open && !transactionToEdit) {
      reset({
        type: 'Expense',
        date: new Date(),
        description: '',
        category: '',
        amount: 0,
      });
    }
  }, [open, transactionToEdit, reset]);

  const handleModalClose = () => {
    setSubmitError(null);
    onClose();
  };

  const onSubmit = async (data: TransactionFormData) => {
    setSubmitError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const signedAmount =
      data.type === 'Expense' ? data.amount * -1 : data.amount;
    const dateValue =
      data.date instanceof Date ? data.date.toISOString() : data.date;

    const dbPayload = {
      user_id: user?.id,
      category_id: data.category,
      amount: signedAmount,
      note: data.description,
      date: dateValue,
      type: data.type,
    };

    if (isEditing) {
      const {} = await supabase
        .from('transactions')
        .update(dbPayload)
        .eq('id', transactionToEdit.id);
    } else {
      const { error } = await supabase.from('transactions').insert(dbPayload);

      if (error) {
        setSubmitError(error.message);
        return;
      }
    }
    reset();
    onClose();
    onSuccess();
  };

  return (
    <Dialog open={open} onClose={handleModalClose} fullWidth maxWidth='sm'>
      <DialogTitle align='center'>{modalTitle}</DialogTitle>
      <DialogContent>
        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <Stack spacing={2}>
            {submitError && <Alert severity='error'>{submitError}</Alert>}

            <Controller
              name='type'
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  value={field.value}
                  exclusive
                  onChange={(_, value: TransactionFormData['type'] | null) => {
                    if (value) {
                      field.onChange(value);
                    }
                  }}
                  aria-label='Transaction type'
                  fullWidth
                >
                  <ToggleButton value='Expense' aria-label='Expense'>
                    Expense
                  </ToggleButton>
                  <ToggleButton value='Income' aria-label='Income'>
                    Income
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name='date'
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label='Date'
                    value={field.value instanceof Date ? field.value : null}
                    onChange={(value) => field.onChange(value ?? '')}
                    slotProps={{
                      textField: {
                        error: Boolean(errors.date),
                        helperText: errors.date?.message,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>

            <TextField
              label='Description'
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
              {...register('description')}
              slotProps={{
                htmlInput: { 'aria-label': 'Transaction description' },
              }}
            />

            <FormControl error={Boolean(errors.category)}>
              <InputLabel id='category-label'>Category</InputLabel>
              <Controller
                name='category'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId='category-label'
                    label='Category'
                    value={field.value || ''}
                  >
                    {categoryOptions.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.category?.message}</FormHelperText>
            </FormControl>

            <TextField
              label='Amount'
              type='number'
              error={Boolean(errors.amount)}
              helperText={errors.amount?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>$</InputAdornment>
                  ),
                },
                htmlInput: {
                  min: 0.01,
                  step: 0.01,
                  'aria-label': 'Transaction amount',
                },
              }}
              {...register('amount', {
                valueAsNumber: true,
              })}
            />
          </Stack>

          <DialogActions sx={{ px: 0, pt: 3 }}>
            <Button onClick={handleModalClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type='submit' variant='contained' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : buttonText}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
