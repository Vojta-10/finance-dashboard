import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import ThemeWrapper from '@/components/ThemeWrapper';
import { CssBaseline } from '@mui/material';

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
        <CssBaseline />
        <AppRouterCacheProvider>
          <ThemeWrapper>{children}</ThemeWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
