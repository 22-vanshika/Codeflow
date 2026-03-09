import { AnimatePresence } from 'framer-motion';
import type { StackFrame } from '../../types';

interface Props {
    stack: StackFrame[];
}

export default function VariablesPanel({ stack }: Props) {
    const topFrame = stack.length > 0 ? stack[stack.length - 1] : null;

    return (
        <div className="flex flex-col h-full font-mono text-xs">
            {!topFrame || Object.keys(topFrame.locals).length === 0 ? (
                <div className="text-center py-4 text-text-muted italic">Empty</div>
            ) : (
                <div className="w-full">
                    <AnimatePresence mode="popLayout">
                        {Object.entries(topFrame.locals).map(([name, value]) => (
                            <div key={name} className="flex items-center justify-between py-2 px-4 border-b border-border-subtle/30 hover:bg-white/5 transition-colors group">
                                <span className="text-text-muted">{name}</span>
                                <span className="text-accent-primary font-bold group-hover:text-white transition-colors">
                                    {JSON.stringify(value)}
                                </span>
                            </div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
