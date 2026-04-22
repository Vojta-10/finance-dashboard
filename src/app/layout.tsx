import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { DataProvider } from '@/context/DataContent';
import ThemeWrapper from '@/components/ThemeWrapper';

export const metadata: Metadata = {
  title: 'Personal Finance Dashboard',
  description: 'Track your income and expenses securely.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <AppRouterCacheProvider>
          <DataProvider>
            <ThemeWrapper>{children}</ThemeWrapper>
          </DataProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
