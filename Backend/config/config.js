module.exports = {
    PORT: process.env.PORT || 5000,
    
    // Timeout for code execution in milliseconds
    EXECUTION_TIMEOUT: 10000,
    
    // Maximum output size in characters
    MAX_OUTPUT_SIZE: 50000,
    
    // Temporary files directory
    TEMP_DIR: 'temp',
    
    // Supported languages configuration
    LANGUAGES: {
        javascript: {
            name: 'JavaScript',
            extension: '.js',
            command: 'node',
            version: 'node --version'
        },
        python: {
            name: 'Python',
            extension: '.py',
            command: 'python',
            version: 'python --version'
        },
        cpp: {
            name: 'C++',
            extension: '.cpp',
            compile: 'g++',
            compileArgs: ['-o'],
            version: 'g++ --version'
        },
        c: {
            name: 'C',
            extension: '.c',
            compile: 'gcc',
            compileArgs: ['-o'],
            version: 'gcc --version'
        },
        java: {
            name: 'Java',
            extension: '.java',
            compile: 'javac',
            command: 'java',
            version: 'java --version'
        },
        typescript: {
            name: 'TypeScript',
            extension: '.ts',
            compile: 'tsc',
            command: 'node',
            version: 'tsc --version'
        },
        ruby: {
            name: 'Ruby',
            extension: '.rb',
            command: 'ruby',
            version: 'ruby --version'
        },
        go: {
            name: 'Go',
            extension: '.go',
            command: 'go run',
            version: 'go version'
        },
        php: {
            name: 'PHP',
            extension: '.php',
            command: 'php',
            version: 'php --version'
        },
        rust: {
            name: 'Rust',
            extension: '.rs',
            compile: 'rustc',
            version: 'rustc --version'
        }
    }
};
