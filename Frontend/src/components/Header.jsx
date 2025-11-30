import { memo } from 'react';
import { LANGUAGES } from '../constants/languages';
import { 
    Play, 
    ChevronDown, 
    Code2, 
    Sparkles,
    Loader2 
} from 'lucide-react';

const Header = memo(function Header({ 
    language, 
    onLanguageChange, 
    onRun, 
    onLoadTemplate,
    isRunning 
}) {
    return (
        <header className="header">
            <div className="header-left">
                <div className="logo">
                    <Code2 size={28} className="logo-icon" />
                    <span className="logo-text">
                        Cod<span className="logo-accent">via</span>
                    </span>
                </div>
            </div>

            <div className="header-center">
                <div className="language-selector">
                    <select 
                        value={language} 
                        onChange={(e) => onLanguageChange(e.target.value)}
                        disabled={isRunning}
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.id} value={lang.id}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="select-arrow" />
                </div>

                <button 
                    className="template-btn"
                    onClick={onLoadTemplate}
                    disabled={isRunning}
                    title="Load starter template"
                >
                    <Sparkles size={16} />
                    <span>Template</span>
                </button>
            </div>

            <div className="header-right">
                <button 
                    className={`run-btn ${isRunning ? 'running' : ''}`}
                    onClick={onRun}
                    disabled={isRunning}
                >
                    {isRunning ? (
                        <>
                            <Loader2 size={18} className="spinner" />
                            <span>Running...</span>
                        </>
                    ) : (
                        <>
                            <Play size={18} fill="currentColor" />
                            <span>Run Code</span>
                        </>
                    )}
                </button>
            </div>
        </header>
    );
});

export default Header;
