export const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', icon: 'js', monacoId: 'javascript' },
    { id: 'python', name: 'Python', icon: 'py', monacoId: 'python' },
    { id: 'cpp', name: 'C++', icon: 'cpp', monacoId: 'cpp' },
    { id: 'c', name: 'C', icon: 'c', monacoId: 'c' },
    { id: 'java', name: 'Java', icon: 'java', monacoId: 'java' },
    { id: 'typescript', name: 'TypeScript', icon: 'ts', monacoId: 'typescript' },
    { id: 'ruby', name: 'Ruby', icon: 'rb', monacoId: 'ruby' },
    { id: 'go', name: 'Go', icon: 'go', monacoId: 'go' },
    { id: 'php', name: 'PHP', icon: 'php', monacoId: 'php' },
    { id: 'rust', name: 'Rust', icon: 'rs', monacoId: 'rust' },
];

export const getLanguageById = (id) => {
    return LANGUAGES.find(lang => lang.id === id) || LANGUAGES[0];
};

export const EDITOR_OPTIONS = {
    fontSize: 14,
    fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
    fontLigatures: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 4,
    wordWrap: 'on',
    lineNumbers: 'on',
    roundedSelection: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    smoothScrolling: true,
    padding: { top: 16, bottom: 16 },
    renderLineHighlight: 'all',
    bracketPairColorization: { enabled: true },
    guides: {
        bracketPairs: true,
        indentation: true,
    },
};

export const EDITOR_THEME = {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
    ],
    colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#c9d1d9',
        'editor.lineHighlightBackground': '#161b22',
        'editor.selectionBackground': '#264f78',
        'editorCursor.foreground': '#58a6ff',
        'editorLineNumber.foreground': '#484f58',
        'editorLineNumber.activeForeground': '#c9d1d9',
        'editor.inactiveSelectionBackground': '#264f7855',
    },
};
