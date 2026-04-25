/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Transaction } from '@/components/dashboard/transactions/types';
import type { Category } from '@/components/dashboard/categories/types';

// 1. Define what our global state looks like
interface DataContextType {
  transactions: Transaction[];
  categories: Category[];
  isLoading: boolean;
  refreshTransactions: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshAll: () => Promise<void>; // A trigger to refetch when you add/delete things
}

// 2. Create the actual context
const DataContext = createContext<DataContextType | undefined>(undefined);

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// 3. Create the Provider component
export function DataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTransactions = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('transactions')
      .select('*, categories (name, color, type)')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (data) setTransactions(data);
  }, []);

  const refreshCategories = useCallback(async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data) setCategories(data);
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch both in parallel for maximum speed!
      await Promise.all([refreshTransactions(), refreshCategories()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [refreshTransactions, refreshCategories]);

  // Fetch exactly once when the app loads
  useEffect(() => {
    const loadData = async () => {
      await refreshAll();
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          refreshAll();
        } else if (event === 'SIGNED_OUT') {
          setTransactions([]);
          setCategories([]);
          setIsLoading(false);
        }
      },
    );

    loadData();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [refreshAll]);

  return (
    <DataContext.Provider
      value={{
        transactions,
        categories,
        isLoading,
        refreshTransactions,
        refreshCategories,
        refreshAll,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// 4. Create a custom hook so your pages can grab the data easily
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
