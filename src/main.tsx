import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SWAHILI EARN Runtime Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, sans-serif',
          background: '#F8FAFC',
          color: '#0F172A',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '480px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            border: '1px solid #E2E8F0'
          }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0066FF', marginBottom: '8px' }}>
              SWAHILI EARN
            </h1>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
              Mfumo Unawekwa Sawa (Initializing...)
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6', marginBottom: '20px' }}>
              Tafadhali bonyeza kitufe hapa chini ili kufungua upya programu.
            </p>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                } catch {}
                window.location.reload();
              }}
              style={{
                background: '#0066FF',
                color: 'white',
                border: 'none',
                fontWeight: 700,
                fontSize: '13px',
                padding: '12px 24px',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              Fungua Upya (Reload)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  );
}
