import { Component } from "react";
import PropTypes from "prop-types";

/**
 * Without this, a single malformed resume record turns the whole app into a
 * blank white page. Keeps the user on a recoverable screen instead.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        if (import.meta.env.DEV) {
            console.error("Unhandled UI error:", error, info);
        }
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div className="w-full min-h-screen flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold text-primary mb-2">Something went wrong</h1>
                    <p className="text-gray-600 mb-6">
                        We couldn&apos;t display this page. Your saved details are safe — please try again.
                    </p>
                    <div className="flex items-center justify-center gap-x-4">
                        <button
                            className="bg-primary text-white font-semibold py-2 px-4 rounded-lg"
                            onClick={() => window.location.reload()}
                        >
                            Reload
                        </button>
                        <button
                            className="bg-zinc-200 text-gray-700 font-semibold py-2 px-4 rounded-lg"
                            onClick={() => {
                                window.location.href = "/";
                            }}
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node,
};

export default ErrorBoundary;
