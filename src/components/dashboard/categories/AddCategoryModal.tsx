'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { categorySchema, type CategoryFormData } from '@/lib/schemas/category';
import { supabase } from '@/lib/supabase/client';
import type { Category } from './types';

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit?: Category | null;
}

const DEFAULT_CATEGORY_COLOR = '#ed6c02';

const normalizeHexColor = (value: string) => {
  const trimmed = value.trim();

  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) {
    return trimmed;
  }

  return DEFAULT_CATEGORY_COLOR;
};

export default function AddCategoryModal({
  open,
  onClose,
  onSuccess,
  categoryToEdit,
}: AddCategoryModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditing = Boolean(categoryToEdit);
  const modalTitle = isEditing ? 'Edit Category' : 'Add Category';
  const buttonText = isEditing ? 'Save Changes' : 'Add Category';

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'Expense',
      color: DEFAULT_CATEGORY_COLOR,
    },
  });

  useEffect(() => {
    if (open && categoryToEdit) {
      reset({
        name: categoryToEdit.name,
        type: categoryToEdit.type,
        color: normalizeHexColor(categoryToEdit.color),
      });
      return;
    }

    if (open) {
      reset({
        name: '',
        type: 'Expense',
        color: DEFAULT_CATEGORY_COLOR,
      });
    }
  }, [open, categoryToEdit, reset]);

  const handleModalClose = () => {
    setSubmitError(null);
    onClose();
  };

  const onSubmit = async (data: CategoryFormData) => {
    setSubmitError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSubmitError('You must be logged in to manage categories.');
      return;
    }

    const dbPayload = {
      user_id: user.id,
      name: data.name.trim(),
      type: data.type,
      color: data.color,
    };

    if (isEditing && categoryToEdit) {
      const { error } = await supabase
        .from('categories')
        .update(dbPayload)
        .eq('id', categoryToEdit.id)
        .eq('user_id', user.id);

      if (error) {
        setSubmitError(error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('categories').insert(dbPayload);

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

            <TextField
              label='Category Name'
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              {...register('name')}
              slotProps={{
                htmlInput: { 'aria-label': 'Category name' },
              }}
            />

            <Controller
              name='type'
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  value={field.value}
                  exclusive
                  onChange={(_, value: CategoryFormData['type'] | null) => {
                    if (value) {
                      field.onChange(value);
                    }
                  }}
                  aria-label='Category type'
                  fullWidth
                >
                  <ToggleButton value='Expense' aria-label='Expense category'>
                    Expense
                  </ToggleButton>
                  <ToggleButton value='Income' aria-label='Income category'>
                    Income
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
            />

            <Controller
              name='color'
              control={control}
              render={({ field }) => (
                <Stack direction='row' spacing={2} alignItems='center'>
                  <TextField
                    label='Color'
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    error={Boolean(errors.color)}
                    helperText={errors.color?.message || 'Use #RRGGBB format'}
                    slotProps={{
                      htmlInput: { 'aria-label': 'Category color hex value' },
                    }}
                    sx={{ flex: 1 }}
                  />
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      component='input'
                      type='color'
                      aria-label='Pick category color'
                      value={normalizeHexColor(field.value)}
                      onChange={(event) => field.onChange(event.target.value)}
                      sx={{
                        width: '100%',
                        height: '100%',
                        border: 0,
                        p: 0,
                        m: 0,
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                      }}
                    />
                  </Box>
                </Stack>
              )}
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
