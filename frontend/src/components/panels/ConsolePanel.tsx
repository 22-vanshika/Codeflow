import { Terminal } from 'lucide-react';

interface Props {
    output: string;
}

export default function ConsolePanel({ output }: Props) {
    return (
        <div className="h-full flex flex-col bg-editor font-mono text-sm">
            <div className="h-8 flex items-center px-4 border-b border-white/10 bg-surface text-text-muted select-none">
                <Terminal size={14} className="mr-2" />
                <span className="text-xs font-bold uppercase">Console Output</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto text-text-primary">
                <span className="text-green-500">➜ </span>
                {output || <span className="text-gray-600 italic">...</span>}
            </div>
        </div>
    );
}
