import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { Buffer } from 'buffer';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { GoogleOAuthProvider } from '@react-oauth/google';

// contexts
import SettingsProvider from './contexts/SettingsContext';
import { store } from './redux/store';
import { arbitrum, avalanche, bsc, fantom, gnosis, mainnet, optimism, polygon } from 'wagmi/chains';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
if (!window.Buffer) {
  window.Buffer = Buffer;
}

const chains = [mainnet, polygon, avalanche, arbitrum, bsc, optimism, gnosis, fantom];

const projectId = process.env.REACT_APP_PROJECT_ID || '';

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
});

createWeb3Modal({ wagmiConfig, projectId, chains });

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="627177543690-6auhc93esd9crfb741ejf7guc5gg0787.apps.googleusercontent.com">
      <WagmiProvider config={wagmiConfig}>
        <HelmetProvider>
          <ReduxProvider store={store}>
            <SettingsProvider>
              <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                  <App />
                </QueryClientProvider>
              </BrowserRouter>
            </SettingsProvider>
          </ReduxProvider>
        </HelmetProvider>
      </WagmiProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
