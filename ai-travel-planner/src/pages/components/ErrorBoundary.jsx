// src/components/ErrorBoundary.jsx

import React from "react";
import styled from "styled-components";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;
  background: #fed7d7;
  border-radius: 12px;
  margin: 2rem;
`;

const ErrorTitle = styled.h2`
  color: #c53030;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #742a2a;
  margin-bottom: 1.5rem;
  max-width: 500px;
`;

const RetryButton = styled.button`
  background: #0070f3;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #005ad1;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    // You can log to an error reporting service here
    // Example: Sentry.captureException(error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>🚨 Oops! Something went wrong</ErrorTitle>
          <ErrorMessage>
            We're sorry, but something unexpected happened. Please try
            refreshing the page or contact support if the problem persists.
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>Try Again</RetryButton>
          {process.env.NODE_ENV === "development" && (
            <details style={{ marginTop: "1rem", textAlign: "left" }}>
              <summary>Error Details (Development)</summary>
              <pre
                style={{
                  color: "#c53030",
                  fontSize: "0.8rem",
                  marginTop: "0.5rem",
                }}
              >
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
