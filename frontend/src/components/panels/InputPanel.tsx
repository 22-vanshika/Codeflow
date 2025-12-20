import { useExecutionStore } from '../../store/executionStore';

export default function InputPanel() {
    const { input, setInput } = useExecutionStore();

    return (
        <div className="flex flex-col h-full w-full bg-bg-panel">
            {/* Header - Already handled by container, but internal useful too */}

            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter program input here (e.g. 10 20)..."
                className="flex-1 w-full bg-transparent text-text-muted p-4 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-accent-cyan/20 rounded-md selection:bg-accent-cyan/20"
                spellCheck={false}
            />
        </div>
    );
}
