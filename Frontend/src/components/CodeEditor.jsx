import { useState, useCallback, useEffect, memo } from 'react';
import Editor from '@monaco-editor/react';
import { EDITOR_OPTIONS, EDITOR_THEME, getLanguageById } from '../constants/languages';
import { Loader2 } from 'lucide-react';

const CodeEditor = memo(function CodeEditor({ 
    code, 
    onChange, 
    language, 
    isReadOnly = false 
}) {
    const [isEditorReady, setIsEditorReady] = useState(false);

    const handleEditorDidMount = useCallback((editor, monaco) => {
        // Define custom theme
        monaco.editor.defineTheme('codvia-dark', EDITOR_THEME);
        monaco.editor.setTheme('codvia-dark');
        setIsEditorReady(true);
        
        // Focus the editor
        editor.focus();
    }, []);

    const handleChange = useCallback((value) => {
        onChange(value || '');
    }, [onChange]);

    const langConfig = getLanguageById(language);

    return (
        <div className="code-editor-container">
            {!isEditorReady && (
                <div className="editor-loading">
                    <Loader2 className="spinner" size={32} />
                    <span>Loading Editor...</span>
                </div>
            )}
            <Editor
                height="100%"
                language={langConfig.monacoId}
                value={code}
                onChange={handleChange}
                onMount={handleEditorDidMount}
                options={{
                    ...EDITOR_OPTIONS,
                    readOnly: isReadOnly,
                }}
                theme="vs-dark"
                loading={null}
            />
        </div>
    );
});

export default CodeEditor;
