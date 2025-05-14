import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App';
import './index.css';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <TamaguiProvider config={tamaguiConfig}>
        <App />
      </TamaguiProvider>
    </RecoilRoot>
  </React.StrictMode>
);
