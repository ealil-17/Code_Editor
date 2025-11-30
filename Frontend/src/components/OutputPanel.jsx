import { memo } from 'react';
import { 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Terminal,
    AlertTriangle,
    Loader2 
} from 'lucide-react';

const OutputPanel = memo(function OutputPanel({ 
    output, 
    error, 
    isLoading, 
    executionTime, 
    exitCode,
    hasRun 
}) {
    const getStatusInfo = () => {
        if (isLoading) {
            return {
                icon: <Loader2 className="status-icon spinner" size={16} />,
                text: 'Running...',
                className: 'running'
            };
        }
        
        if (!hasRun) {
            return {
                icon: <Terminal className="status-icon" size={16} />,
                text: 'Ready',
                className: 'ready'
            };
        }

        if (error && error.trim()) {
            return {
                icon: <AlertTriangle className="status-icon" size={16} />,
                text: `Exit Code: ${exitCode}`,
                className: 'warning'
            };
        }

        if (exitCode === 0) {
            return {
                icon: <CheckCircle2 className="status-icon" size={16} />,
                text: 'Success',
                className: 'success'
            };
        }

        return {
            icon: <XCircle className="status-icon" size={16} />,
            text: `Exit Code: ${exitCode}`,
            className: 'error'
        };
    };

    const status = getStatusInfo();

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="output-loading">
                    <Loader2 className="spinner" size={40} />
                    <span>Executing your code...</span>
                </div>
            );
        }

        if (!hasRun) {
            return (
                <div className="output-placeholder">
                    <Terminal size={48} strokeWidth={1} />
                    <h3>Output will appear here</h3>
                    <p>Write some code and click "Run" or press Ctrl+Enter</p>
                </div>
            );
        }

        const hasOutput = output && output.trim();
        const hasError = error && error.trim();

        if (!hasOutput && !hasError) {
            return (
                <div className="output-empty">
                    <CheckCircle2 size={32} />
                    <span>Program executed with no output</span>
                </div>
            );
        }

        return (
            <div className="output-content">
                {hasOutput && (
                    <pre className="output-text">{output}</pre>
                )}
                {hasError && (
                    <pre className="output-error">{error}</pre>
                )}
            </div>
        );
    };

    return (
        <div className="output-panel">
            <div className="output-header">
                <div className="output-title">
                    <Terminal size={18} />
                    <span>Output</span>
                </div>
                {hasRun && executionTime !== null && (
                    <div className="execution-time">
                        <Clock size={14} />
                        <span>{executionTime}ms</span>
                    </div>
                )}
            </div>
            
            <div className="output-body">
                {renderContent()}
            </div>

            <div className={`output-status ${status.className}`}>
                {status.icon}
                <span>{status.text}</span>
            </div>
        </div>
    );
});

export default OutputPanel;
