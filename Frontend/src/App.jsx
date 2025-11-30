import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import OutputPanel from './components/OutputPanel';
import InputPanel from './components/InputPanel';
import { executeCode, getBoilerplate } from './services/api';
import './App.css';

function App() {
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [executionTime, setExecutionTime] = useState(null);
    const [exitCode, setExitCode] = useState(null);
    const [hasRun, setHasRun] = useState(false);

    // Load boilerplate on mount and language change
    const loadTemplate = useCallback(async () => {
        const result = await getBoilerplate(language);
        if (result && result.success) {
            setCode(result.code);
        }
    }, [language]);

    useEffect(() => {
        loadTemplate();
    }, [language]);

    const handleLanguageChange = useCallback((newLanguage) => {
        setLanguage(newLanguage);
        setHasRun(false);
        setOutput('');
        setError('');
        setExecutionTime(null);
        setExitCode(null);
    }, []);

    const handleRun = useCallback(async () => {
        if (!code.trim()) {
            setError('Please write some code first!');
            setHasRun(true);
            return;
        }

        setIsRunning(true);
        setHasRun(true);
        setOutput('');
        setError('');

        try {
            const result = await executeCode(language, code, input);
            
            if (result.success !== undefined) {
                setOutput(result.output || '');
                setError(result.error || '');
                setExecutionTime(result.executionTime);
                setExitCode(result.exitCode);
            } else {
                setError(result.error || 'Unknown error occurred');
                setExitCode(1);
            }
        } catch (err) {
            setError(err.message || 'Failed to execute code');
            setExitCode(1);
        } finally {
            setIsRunning(false);
        }
    }, [language, code, input]);

    // Keyboard shortcut: Ctrl+Enter to run
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                handleRun();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleRun]);

    return (
        <div className="app">
            <Header
                language={language}
                onLanguageChange={handleLanguageChange}
                onRun={handleRun}
                onLoadTemplate={loadTemplate}
                isRunning={isRunning}
            />

            <main className="main-container">
                <div className="editor-section">
                    <div className="editor-wrapper">
                        <CodeEditor
                            code={code}
                            onChange={setCode}
                            language={language}
                            isReadOnly={isRunning}
                        />
                    </div>
                    <InputPanel
                        input={input}
                        onChange={setInput}
                        disabled={isRunning}
                    />
                </div>

                <div className="output-section">
                    <OutputPanel
                        output={output}
                        error={error}
                        isLoading={isRunning}
                        executionTime={executionTime}
                        exitCode={exitCode}
                        hasRun={hasRun}
                    />
                </div>
            </main>
        </div>
    );
}

export default App;
