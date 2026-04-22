'use client';

import ConfirmDialog from '@/components/common/ConfirmDialog';
import AddCategoryModal from '@/components/dashboard/categories/AddCategoryModal';
import type { Category } from '@/components/dashboard/categories/types';
import { useData } from '@/context/DataContent';
import { supabase } from '@/lib/supabase/client';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';

const DEFAULT_CATEGORY_COLOR = '#9e9e9e';

function normalizeCategoryColor(value: unknown): string {
  const asString = String(value ?? '').trim();

  if (/^#[0-9A-Fa-f]{6}$/.test(asString)) {
    return asString;
  }

  return DEFAULT_CATEGORY_COLOR;
}

function CategoryColumn({
  title,
  subtitle,
  categories,
  onEdit,
  onDelete,
}: {
  title: string;
  subtitle: string;
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}) {
  return (
    <Stack spacing={1.5}>
      <Box>
        <Typography variant='h6' fontWeight={700}>
          {title}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {subtitle}
        </Typography>
      </Box>

      {categories.length === 0 ? (
        <Box
          sx={{
            py: 4,
            px: 2,
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography variant='body2' color='text.secondary'>
            No categories yet.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.25}>
          {categories.map((category) => {
            const accentColor = normalizeCategoryColor(category.color);

            return (
              <Box
                key={category.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderLeft: `4px solid ${accentColor}`,
                  px: 2,
                  py: 1.25,
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  '& .row-actions': {
                    opacity: { xs: 1, md: 0 },
                    transform: {
                      xs: 'translateX(0)',
                      md: 'translateX(4px)',
                    },
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                  },
                  '&:hover .row-actions': {
                    opacity: 1,
                    transform: 'translateX(0)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: accentColor,
                    }}
                  />
                  <Typography fontWeight={600}>{category.name}</Typography>
                </Box>

                <Box className='row-actions' sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    size='small'
                    aria-label={`Edit ${category.name}`}
                    onClick={() => onEdit(category)}
                  >
                    <EditOutlinedIcon fontSize='small' />
                  </IconButton>
                  <IconButton
                    size='small'
                    color='error'
                    aria-label={`Delete ${category.name}`}
                    onClick={() => onDelete(category)}
                  >
                    <DeleteOutlineRoundedIcon fontSize='small' />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

export default function CategoriesPage() {
  const [pageError, setPageError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const { categories, isLoading, refreshCategories } = useData();

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === 'Expense'),
    [categories],
  );

  const incomeCategories = useMemo(
    () => categories.filter((category) => category.type === 'Income'),
    [categories],
  );

  const handleOpenCreate = () => {
    setCategoryToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setCategoryToEdit(category);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) {
      return;
    }

    setIsDeleting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPageError('You must be logged in to delete categories.');
      setIsDeleting(false);
      return;
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryToDelete.id)
      .eq('user_id', user.id);

    if (error) {
      setPageError(error.message);
      setIsDeleting(false);
      return;
    }

    setIsDeleting(false);
    setCategoryToDelete(null);
    refreshCategories();
  };

  return (
    <>
      <AddCategoryModal
        open={isFormOpen}
        categoryToEdit={categoryToEdit}
        onClose={() => setIsFormOpen(false)}
        onSuccess={refreshCategories}
      />

      <Card sx={{ p: { xs: 2, md: 3 }, mt: 2, boxShadow: 1 }}>
        <Stack spacing={3}>
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
            }}
          >
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                Categories
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Organize spending and earnings with custom category groups.
              </Typography>
            </Box>

            <Button
              variant='contained'
              startIcon={<AddRoundedIcon />}
              onClick={handleOpenCreate}
            >
              Add New Category
            </Button>
          </Box>

          {pageError && <Alert severity='error'>{pageError}</Alert>}

          {isLoading ? (
            <Box
              sx={{
                minHeight: 260,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
                alignItems: 'start',
              }}
            >
              <CategoryColumn
                title='Expense Categories'
                subtitle='Used to classify outgoing money.'
                categories={expenseCategories}
                onEdit={handleOpenEdit}
                onDelete={setCategoryToDelete}
              />
              <CategoryColumn
                title='Income Categories'
                subtitle='Used to classify incoming money.'
                categories={incomeCategories}
                onEdit={handleOpenEdit}
                onDelete={setCategoryToDelete}
              />
            </Box>
          )}
        </Stack>
      </Card>

      <ConfirmDialog
        open={Boolean(categoryToDelete)}
        title='Delete Category'
        message={`Are you sure you want to delete "${categoryToDelete?.name ?? ''}"? This cannot be undone.`}
        confirmText='Delete'
        isPending={isDeleting}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
