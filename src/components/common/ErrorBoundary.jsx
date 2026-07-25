import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Page crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', padding: 40, textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔧</div>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 16 }}>
            这里出了点小问题
          </p>
          <button
            className="hand-drawn-btn primary"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
          >
            🔄 刷新页面
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
