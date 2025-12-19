import { motion, AnimatePresence } from 'framer-motion';
import type { StackFrame } from '../../store/executionStore';

interface Props {
    stack: StackFrame[];
}

export default function CallStackPanel({ stack }: Props) {
    // Reverse stack to show top-of-stack first (visual preference often varies, but Left->Right growth is good for horizontal)
    // Or Top->Bottom for vertical. The new UI has a box for it.

    // Reference UI suggestion: Horizontal blocks.
    const reversedStack = [...stack].reverse();

    return (
        <div className="h-full flex items-center p-4 overflow-x-auto custom-scrollbar">
            <div className="flex space-x-4 items-start min-w-max">
                <AnimatePresence mode="popLayout">
                    {stack.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            className="text-text-muted text-xs italic w-full text-center"
                        >
                            Call stack empty (Program not running)
                        </motion.div>
                    ) : (
                        <div className="flex space-x-6">
                            {reversedStack.map((frame, index) => (
                                <StackFrameNode
                                    key={`${frame.function}-${stack.length - 1 - index}`}
                                    frame={frame}
                                    isTop={index === 0}
                                    hasNext={index < reversedStack.length - 1}
                                />
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function StackFrameNode({ frame, isTop, hasNext }: { frame: StackFrame, isTop: boolean, hasNext: boolean }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="relative"
        >
            {/* Frame Box */}
            <div className={`
                w-36 bg-bg-main border rounded-lg overflow-hidden flex flex-col shadow-lg
                ${isTop ? 'border-accent-cyan shadow-glow ring-1 ring-accent-cyan/20' : 'border-border-subtle opacity-70'}
            `}>
                {/* Header */}
                <div className={`px-3 py-1.5 border-b text-center ${isTop ? 'bg-accent-cyan/10 border-accent-cyan/30' : 'bg-bg-panel border-border-subtle'}`}>
                    <span className={`text-xs font-bold font-mono ${isTop ? 'text-accent-cyan' : 'text-text-muted'}`}>
                        {frame.function}()
                    </span>
                </div>

                {/* Locals Preview */}
                <div className="p-2 space-y-1 min-h-[50px] bg-bg-panel/50">
                    {Object.keys(frame.locals).length === 0 ? (
                        <div className="text-[10px] text-text-muted italic text-center mt-2">void</div>
                    ) : (
                        Object.entries(frame.locals).slice(0, 3).map(([key, val]) => (
                            <div key={key} className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-text-primary opacity-80">{key}</span>
                                <span className="text-accent-primary">{JSON.stringify(val)}</span>
                            </div>
                        ))
                    )}
                    {Object.keys(frame.locals).length > 3 && (
                        <div className="text-[9px] text-text-muted text-center pt-1">...</div>
                    )}
                </div>
            </div>

            {/* Connection Arrow (if not the last/bottom frame) */}
            {hasNext && (
                <div className="absolute top-1/2 -right-6 w-6 h-[1px] bg-border-active/50">
                    <div className="absolute right-0 -top-[3px] w-2 h-2 border-t border-r border-border-active/50 rotate-45"></div>
                </div>
            )}
        </motion.div>
    );
}
