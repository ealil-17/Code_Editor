const { spawn, exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

class CodeExecutor {
    constructor() {
        this.tempDir = path.join(__dirname, '..', config.TEMP_DIR);
        this.initTempDir();
    }

    async initTempDir() {
        try {
            await fs.mkdir(this.tempDir, { recursive: true });
        } catch (error) {
            console.error('Error creating temp directory:', error);
        }
    }

    async execute(language, code, input = '') {
        const langConfig = config.LANGUAGES[language];
        
        if (!langConfig) {
            throw new Error(`Unsupported language: ${language}`);
        }

        const fileId = uuidv4();
        
        try {
            switch (language) {
                case 'javascript':
                    return await this.executeJavaScript(code, input, fileId);
                case 'python':
                    return await this.executePython(code, input, fileId);
                case 'cpp':
                    return await this.executeCpp(code, input, fileId);
                case 'c':
                    return await this.executeC(code, input, fileId);
                case 'java':
                    return await this.executeJava(code, input, fileId);
                case 'typescript':
                    return await this.executeTypeScript(code, input, fileId);
                case 'ruby':
                    return await this.executeRuby(code, input, fileId);
                case 'go':
                    return await this.executeGo(code, input, fileId);
                case 'php':
                    return await this.executePHP(code, input, fileId);
                case 'rust':
                    return await this.executeRust(code, input, fileId);
                default:
                    throw new Error(`Execution not implemented for: ${language}`);
            }
        } catch (error) {
            throw error;
        }
    }

    async executeJavaScript(code, input, fileId) {
        const filePath = path.join(this.tempDir, `${fileId}.js`);
        await fs.writeFile(filePath, code);

        try {
            const result = await this.runCommand('node', [filePath], input);
            return result;
        } finally {
            await this.cleanup([filePath]);
        }
    }

    async executePython(code, input, fileId) {
        const filePath = path.join(this.tempDir, `${fileId}.py`);
        await fs.writeFile(filePath, code);

        try {
            const result = await this.runCommand('python', [filePath], input);
            return result;
        } finally {
            await this.cleanup([filePath]);
        }
    }

    async executeCpp(code, input, fileId) {
        const sourcePath = path.join(this.tempDir, `${fileId}.cpp`);
        const execPath = path.join(this.tempDir, `${fileId}.exe`);
        await fs.writeFile(sourcePath, code);

        try {
            // Compile
            const compileResult = await this.runCommand('g++', [sourcePath, '-o', execPath], '');
            if (compileResult.stderr && !compileResult.stdout) {
                return { output: '', error: compileResult.stderr, executionTime: 0 };
            }

            // Execute
            const result = await this.runCommand(execPath, [], input);
            return result;
        } finally {
            await this.cleanup([sourcePath, execPath]);
        }
    }

    async executeC(code, input, fileId) {
        const sourcePath = path.join(this.tempDir, `${fileId}.c`);
        const execPath = path.join(this.tempDir, `${fileId}.exe`);
        await fs.writeFile(sourcePath, code);

        try {
            // Compile
            const compileResult = await this.runCommand('gcc', [sourcePath, '-o', execPath], '');
            if (compileResult.stderr && !compileResult.stdout) {
                return { output: '', error: compileResult.stderr, executionTime: 0 };
            }

            // Execute
            const result = await this.runCommand(execPath, [], input);
            return result;
        } finally {
            await this.cleanup([sourcePath, execPath]);
        }
    }

    async executeJava(code, input, fileId) {
        // Extract class name from code
        const classNameMatch = code.match(/public\s+class\s+(\w+)/);
        const className = classNameMatch ? classNameMatch[1] : 'Main';
        
        const sourcePath = path.join(this.tempDir, `${className}.java`);
        const classPath = path.join(this.tempDir, `${className}.class`);
        await fs.writeFile(sourcePath, code);

        try {
            // Compile
            const compileResult = await this.runCommand('javac', [sourcePath], '');
            if (compileResult.stderr && !compileResult.stdout) {
                return { output: '', error: compileResult.stderr, executionTime: 0 };
            }

            // Execute
            const result = await this.runCommand('java', ['-cp', this.tempDir, className], input);
            return result;
        } finally {
            await this.cleanup([sourcePath, classPath]);
        }
    }

    async executeTypeScript(code, input, fileId) {
        const tsPath = path.join(this.tempDir, `${fileId}.ts`);
        const jsPath = path.join(this.tempDir, `${fileId}.js`);
        await fs.writeFile(tsPath, code);

        try {
            // Compile TypeScript to JavaScript
            const compileResult = await this.runCommand('tsc', [tsPath, '--outDir', this.tempDir], '');
            if (compileResult.stderr && !compileResult.stdout) {
                return { output: '', error: compileResult.stderr, executionTime: 0 };
            }

            // Execute the compiled JavaScript
            const result = await this.runCommand('node', [jsPath], input);
            return result;
        } finally {
            await this.cleanup([tsPath, jsPath]);
        }
    }

    async executeRuby(code, input, fileId) {
        const filePath = path.join(this.tempDir, `${fileId}.rb`);
        await fs.writeFile(filePath, code);

        try {
            const result = await this.runCommand('ruby', [filePath], input);
            return result;
        } finally {
            await this.cleanup([filePath]);
        }
    }

    async executeGo(code, input, fileId) {
        const filePath = path.join(this.tempDir, `${fileId}.go`);
        await fs.writeFile(filePath, code);

        try {
            const result = await this.runCommand('go', ['run', filePath], input);
            return result;
        } finally {
            await this.cleanup([filePath]);
        }
    }

    async executePHP(code, input, fileId) {
        const filePath = path.join(this.tempDir, `${fileId}.php`);
        await fs.writeFile(filePath, code);

        try {
            const result = await this.runCommand('php', [filePath], input);
            return result;
        } finally {
            await this.cleanup([filePath]);
        }
    }

    async executeRust(code, input, fileId) {
        const sourcePath = path.join(this.tempDir, `${fileId}.rs`);
        const execPath = path.join(this.tempDir, `${fileId}.exe`);
        await fs.writeFile(sourcePath, code);

        try {
            // Compile
            const compileResult = await this.runCommand('rustc', [sourcePath, '-o', execPath], '');
            if (compileResult.stderr && !compileResult.stdout) {
                return { output: '', error: compileResult.stderr, executionTime: 0 };
            }

            // Execute
            const result = await this.runCommand(execPath, [], input);
            return result;
        } finally {
            await this.cleanup([sourcePath, execPath]);
        }
    }

    runCommand(command, args, input) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            let stdout = '';
            let stderr = '';

            const process = spawn(command, args, {
                cwd: this.tempDir,
                shell: true
            });

            // Set timeout
            const timeout = setTimeout(() => {
                process.kill('SIGTERM');
                reject(new Error('Execution timed out'));
            }, config.EXECUTION_TIMEOUT);

            // Send input if provided
            if (input) {
                process.stdin.write(input);
                process.stdin.end();
            } else {
                process.stdin.end();
            }

            process.stdout.on('data', (data) => {
                stdout += data.toString();
                if (stdout.length > config.MAX_OUTPUT_SIZE) {
                    process.kill('SIGTERM');
                    stdout = stdout.substring(0, config.MAX_OUTPUT_SIZE) + '\n... Output truncated';
                }
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                clearTimeout(timeout);
                const executionTime = Date.now() - startTime;
                
                resolve({
                    output: stdout,
                    error: stderr,
                    exitCode: code,
                    executionTime
                });
            });

            process.on('error', (error) => {
                clearTimeout(timeout);
                reject(error);
            });
        });
    }

    async cleanup(files) {
        for (const file of files) {
            try {
                await fs.unlink(file);
            } catch (error) {
                // Ignore cleanup errors
            }
        }
    }
}

module.exports = new CodeExecutor();
