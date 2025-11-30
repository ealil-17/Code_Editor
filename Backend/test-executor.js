const executor = require('./services/codeExecutor');
const sanitizer = require('./services/errorSanitizer');

const code = `#include <stdio.h>
int main() {
    printf("Hello")
    return 0;
}`;

console.log('Testing C code execution with error...');
executor.execute('c', code, '').then(result => {
    console.log('=== Raw Result ===');
    console.log('Output:', JSON.stringify(result.output));
    console.log('Error:', JSON.stringify(result.error));
    console.log('ExitCode:', result.exitCode);
    console.log('ExecutionTime:', result.executionTime);
    
    console.log('\n=== Sanitized ===');
    const sanitizedError = sanitizer.sanitize(result.error, 'c');
    const errorType = sanitizer.getErrorType(result.error);
    console.log('Sanitized Error:', sanitizedError);
    console.log('Error Type:', errorType);
}).catch(err => {
    console.error('Exception:', err);
});
