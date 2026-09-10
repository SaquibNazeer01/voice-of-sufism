import React from 'react';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Readonly<Props>;
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0b',
          color: '#fcd34d',
          fontFamily: 'Georgia, serif',
          padding: '2rem',
          textAlign: 'center',
          gap: '1.5rem'
        }}>
          <div style={{ fontSize: '3rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fef3c7' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#a3a3a3', maxWidth: '480px' }}>
            An unexpected error occurred while rendering. Please reload the page or return to the main site.
          </p>
          {this.state.error && (
            <pre style={{
              background: '#1c1c1e',
              color: '#f87171',
              padding: '1rem',
              borderRadius: '0.75rem',
              fontSize: '0.75rem',
              maxWidth: '600px',
              overflowX: 'auto',
              textAlign: 'left',
              border: '1px solid #3f1212'
            }}>
              {this.state.error.message}
            </pre>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 1.75rem',
                background: '#b45309',
                color: '#fff',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Reload Page
            </button>
            <button
              onClick={() => {
                try {
                  localStorage.removeItem('voice_of_sufism_in_admin_mode');
                } catch {}
                window.location.href = window.location.origin;
              }}
              style={{
                padding: '0.75rem 1.75rem',
                background: '#27272a',
                color: '#fef3c7',
                border: '1px solid #3f3f46',
                borderRadius: '0.75rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Return to Public Site
            </button>
          </div>
        </div>
      );
    }
    return <>{this.props.children}</>;
  }
}
