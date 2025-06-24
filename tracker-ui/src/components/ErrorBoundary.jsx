import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          backgroundColor: '#111827',
          border: '2px solid #dc2626',
          borderRadius: '1rem',
          margin: '2rem',
          color: '#ffffff'
        }}>
          <h2 style={{
            color: '#dc2626',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            ⚠️ Something went wrong
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            The PowerHouse Tracker encountered an error. Please refresh the page or contact support.
          </p>
          <details style={{ 
            backgroundColor: '#1f2937', 
            padding: '1rem', 
            borderRadius: '0.5rem',
            marginTop: '1rem'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Technical Details
            </summary>
            <pre style={{ 
              color: '#9ca3af', 
              fontSize: '0.875rem', 
              marginTop: '0.5rem',
              whiteSpace: 'pre-wrap'
            }}>
              {this.state.error && this.state.error.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
