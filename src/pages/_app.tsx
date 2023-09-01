import { type AppType } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Provider } from 'jotai';
import { Analytics } from '@vercel/analytics/react';

import '~/styles/globals.css';

const MyApp: AppType = ({ Component, pageProps }) => (
  <ThemeProvider>
    <Provider>
      <Component {...pageProps} />
      <Analytics />
    </Provider>
  </ThemeProvider>
);

export default MyApp;
