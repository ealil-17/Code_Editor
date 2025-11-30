import { memo } from 'react';
import { FileInput, HelpCircle } from 'lucide-react';

const InputPanel = memo(function InputPanel({ input, onChange, disabled }) {
    return (
        <div className="input-panel">
            <div className="input-header">
                <div className="input-title">
                    <FileInput size={16} />
                    <span>Input (stdin)</span>
                </div>
                <div className="input-hint" title="Separate multiple inputs with newlines">
                    <HelpCircle size={14} />
                </div>
            </div>
            <textarea
                className="input-textarea"
                value={input}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter program input here (one per line)..."
                disabled={disabled}
                spellCheck={false}
            />
        </div>
    );
});

export default InputPanel;
