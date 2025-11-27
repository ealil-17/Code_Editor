const codeExecutor = require('../services/codeExecutor');
const languageService = require('../services/languageService');

const executeCode = async (req, res, next) => {
    try {
        const { language, code, input } = req.body;

        // Validate request
        if (!language) {
            return res.status(400).json({
                success: false,
                error: 'Language is required'
            });
        }

        if (!code || code.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Code is required'
            });
        }

        // Check if language is supported
        if (!languageService.isLanguageSupported(language)) {
            return res.status(400).json({
                success: false,
                error: `Language '${language}' is not supported`,
                supportedLanguages: languageService.getSupportedLanguages().map(l => l.id)
            });
        }

        console.log(`Executing ${language} code...`);
        
        // Execute the code
        const result = await codeExecutor.execute(language, code, input || '');

        res.json({
            success: true,
            language,
            output: result.output,
            error: result.error,
            exitCode: result.exitCode,
            executionTime: result.executionTime
        });

    } catch (error) {
        console.error('Execution error:', error);
        
        // Handle specific errors
        if (error.message === 'Execution timed out') {
            return res.status(408).json({
                success: false,
                error: 'Code execution timed out. Please check for infinite loops or optimize your code.'
            });
        }

        res.status(500).json({
            success: false,
            error: error.message || 'Code execution failed'
        });
    }
};

const getBoilerplate = (req, res) => {
    const { language } = req.params;

    if (!languageService.isLanguageSupported(language)) {
        return res.status(400).json({
            success: false,
            error: `Language '${language}' is not supported`
        });
    }

    const boilerplate = languageService.getBoilerplate(language);
    const langConfig = languageService.getLanguageConfig(language);

    res.json({
        success: true,
        language,
        name: langConfig.name,
        code: boilerplate
    });
};

module.exports = {
    executeCode,
    getBoilerplate
};
