/**
 * Error Sanitizer Service
 * Sanitizes and simplifies error messages for user-friendly display
 * while preventing exposure of sensitive server information
 */

class ErrorSanitizer {
    constructor() {
        // Patterns to remove from error messages (security-sensitive)
        this.sensitivePatterns = [
            // File paths - Windows
            /[A-Za-z]:\\[^\s:]+/g,
            // File paths - Unix
            /\/(?:home|usr|var|tmp|etc|opt)[^\s:]+/g,
            // Temp directory paths
            /\\temp\\[a-f0-9-]+/gi,
            /\/temp\/[a-f0-9-]+/gi,
            // UUID patterns in paths
            /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi,
            // Stack traces with node_modules
            /at\s+.*node_modules.*/g,
            // Internal stack traces
            /at\s+internal\/.*/g,
            // Server IP addresses
            /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
            // Environment variables
            /process\.env\.\w+/g,
        ];

        // Common error patterns and their user-friendly messages
        this.errorMappings = {
            // Compiler/Runtime not found - be very specific
            'is not recognized as an internal or external command': {
                message: 'The compiler/interpreter for this language is not installed on the server.',
                type: 'RUNTIME_NOT_FOUND'
            },
            'command not found': {
                message: 'The compiler/interpreter for this language is not installed on the server.',
                type: 'RUNTIME_NOT_FOUND'
            },
            'Python was not found': {
                message: 'Python is not installed on the server.',
                type: 'RUNTIME_NOT_FOUND'
            },
            'No such file or directory': {
                keepOriginal: false,
                message: 'Compilation failed or runtime not available.',
                type: 'RUNTIME_NOT_FOUND'
            },
            'javac: command not found': {
                message: 'Java compiler (JDK) is not installed on the server.',
                type: 'RUNTIME_NOT_FOUND'
            },
            'g++: command not found': {
                message: 'C++ compiler (g++) is not installed on the server.',
                type: 'RUNTIME_NOT_FOUND'
            },
            'gcc: command not found': {
                message: 'C compiler (gcc) is not installed on the server.',
                type: 'RUNTIME_NOT_FOUND'
            },

            // Syntax errors
            'SyntaxError': {
                keepOriginal: true,
                type: 'SYNTAX_ERROR'
            },
            'IndentationError': {
                keepOriginal: true,
                type: 'SYNTAX_ERROR'
            },
            'error: expected': {
                keepOriginal: true,
                type: 'SYNTAX_ERROR'
            },

            // Runtime errors
            'ReferenceError': {
                keepOriginal: true,
                type: 'RUNTIME_ERROR'
            },
            'TypeError': {
                keepOriginal: true,
                type: 'RUNTIME_ERROR'
            },
            'NameError': {
                keepOriginal: true,
                type: 'RUNTIME_ERROR'
            },
            'ValueError': {
                keepOriginal: true,
                type: 'RUNTIME_ERROR'
            },
            'segmentation fault': {
                message: 'Segmentation fault: Your program tried to access invalid memory.',
                type: 'RUNTIME_ERROR'
            },
            'core dumped': {
                message: 'Program crashed: Memory access violation.',
                type: 'RUNTIME_ERROR'
            },

            // Resource limits
            'killed': {
                message: 'Program was terminated: Exceeded resource limits (memory/CPU).',
                type: 'RESOURCE_LIMIT'
            },
            'out of memory': {
                message: 'Program ran out of memory.',
                type: 'RESOURCE_LIMIT'
            },

            // Compilation errors
            'undefined reference': {
                keepOriginal: true,
                type: 'COMPILATION_ERROR'
            },
            'error:': {
                keepOriginal: true,
                type: 'COMPILATION_ERROR'
            },
            'cannot find symbol': {
                keepOriginal: true,
                type: 'COMPILATION_ERROR'
            },
        };

        // Priority order for checking errors (most specific first)
        this.checkOrder = [
            // Compilation errors (most specific, check first)
            'error: expected',
            'undefined reference',
            'cannot find symbol',
            'error:',
            // Syntax errors
            'SyntaxError',
            'IndentationError',
            // Runtime errors  
            'ReferenceError',
            'TypeError',
            'NameError',
            'ValueError',
            'segmentation fault',
            'core dumped',
            // Resource limits
            'killed',
            'out of memory',
            // Runtime not found (least specific, check last)
            'Python was not found',
            'javac: command not found',
            'g++: command not found',
            'gcc: command not found',
            'is not recognized as an internal or external command',
            'command not found',
            'No such file or directory',
        ];
    }

    /**
     * Sanitize error message - main entry point
     */
    sanitize(error, language) {
        if (!error || typeof error !== 'string') {
            return '';
        }

        let sanitizedError = error;

        // Check for known error patterns in priority order
        for (const pattern of this.checkOrder) {
            if (error.toLowerCase().includes(pattern.toLowerCase())) {
                const handling = this.errorMappings[pattern];
                if (handling) {
                    if (handling.keepOriginal) {
                        // Keep the error but sanitize sensitive info
                        sanitizedError = this.removeSensitiveInfo(error);
                        sanitizedError = this.extractRelevantLines(sanitizedError, language);
                        return sanitizedError;
                    } else {
                        // Return the predefined user-friendly message
                        return handling.message;
                    }
                }
            }
        }

        // Default: sanitize and simplify
        sanitizedError = this.removeSensitiveInfo(sanitizedError);
        sanitizedError = this.extractRelevantLines(sanitizedError, language);
        
        return sanitizedError;
    }

    /**
     * Remove sensitive information from error messages
     */
    removeSensitiveInfo(error) {
        let cleaned = error;

        // Remove sensitive patterns
        for (const pattern of this.sensitivePatterns) {
            cleaned = cleaned.replace(pattern, '[path]');
        }

        // Clean up multiple [path] replacements
        cleaned = cleaned.replace(/\[path\][\\/]?/g, '');
        
        // Remove empty lines and excessive whitespace
        cleaned = cleaned
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n');

        return cleaned;
    }

    /**
     * Extract only the relevant error lines for each language
     */
    extractRelevantLines(error, language) {
        const lines = error.split('\n');
        const relevantLines = [];
        
        for (const line of lines) {
            // Skip internal paths and stack traces
            if (this.isInternalLine(line)) {
                continue;
            }

            // Extract based on language
            const cleaned = this.cleanLineForLanguage(line, language);
            if (cleaned) {
                relevantLines.push(cleaned);
            }
        }

        // Limit the number of error lines
        const maxLines = 10;
        if (relevantLines.length > maxLines) {
            return relevantLines.slice(0, maxLines).join('\n') + '\n... (error truncated)';
        }

        return relevantLines.join('\n');
    }

    /**
     * Check if a line is internal/system-related
     */
    isInternalLine(line) {
        const internalPatterns = [
            /^\s*at\s+internal\//,
            /^\s*at\s+node:/,
            /^\s*at\s+Module\./,
            /^\s*at\s+Object\.\./,
            /^\s*at\s+TracingChannel/,
            /^\s*at\s+wrapModuleLoad/,
            /node_modules/,
            /^\s*\^+\s*$/,  // Just caret markers without context
            /cjs\/loader/,
            /diagnostics_channel/,
        ];

        return internalPatterns.some(pattern => pattern.test(line));
    }

    /**
     * Clean error line based on language
     */
    cleanLineForLanguage(line, language) {
        if (!line.trim()) return null;

        // Skip stack trace lines (at Something)
        if (/^\s*at\s+/.test(line)) {
            return null;
        }

        // Remove file paths but keep line numbers and error messages
        let cleaned = line;

        // For C/C++: "file.c:10:5: error: message" -> "Line 10: error: message"
        const cMatch = cleaned.match(/\.(?:c|cpp|h|hpp):\s*(\d+):\s*\d*:?\s*(.+)/i);
        if (cMatch) {
            return `Line ${cMatch[1]}: ${cMatch[2]}`;
        }

        // For Java: "File.java:10: error: message" -> "Line 10: error: message"
        const javaMatch = cleaned.match(/\.java:\s*(\d+):\s*(.+)/i);
        if (javaMatch) {
            return `Line ${javaMatch[1]}: ${javaMatch[2]}`;
        }

        // For Python: 'File "...", line 10' -> 'Line 10'
        const pyMatch = cleaned.match(/File\s+"[^"]*",\s*line\s+(\d+)/i);
        if (pyMatch) {
            return `Line ${pyMatch[1]}:`;
        }

        // For JavaScript/TypeScript: Keep error type and message
        const jsMatch = cleaned.match(/((?:Reference|Type|Syntax|Range|URI|Eval)Error:?\s*.+)/i);
        if (jsMatch) {
            return jsMatch[1];
        }

        // Skip lines that are just numbers or colons
        if (/^:\d+$/.test(cleaned.trim())) {
            return null;
        }

        // Keep code context lines that show the error location
        if (cleaned.includes('console.') || cleaned.includes('print') || 
            cleaned.includes('printf') || cleaned.includes('cout')) {
            // This is likely the code that caused the error
            return `Code: ${cleaned.trim().substring(0, 80)}`;
        }

        // Generic: if contains "error" or "warning", keep it
        if (/error|warning|exception/i.test(cleaned)) {
            return cleaned.substring(0, 200); // Limit length
        }

        // For code context lines (showing the problematic code)
        if (/^\s*\d+\s*\|/.test(cleaned) || /^\s*>/.test(cleaned)) {
            return cleaned.substring(0, 100);
        }

        return cleaned.substring(0, 150);
    }

    /**
     * Get error type for frontend categorization
     */
    getErrorType(error) {
        if (!error) return 'UNKNOWN';

        for (const [pattern, handling] of Object.entries(this.errorMappings)) {
            if (error.toLowerCase().includes(pattern.toLowerCase())) {
                return handling.type;
            }
        }

        return 'UNKNOWN';
    }
}

module.exports = new ErrorSanitizer();
