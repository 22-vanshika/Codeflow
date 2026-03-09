

export default function MemoryPanel() {
    // Currently, the backend C++ executor does not support Pointer/Reference logic or Heap allocation (new/delete).
    // It only supports stack-based variables.
    // We display a placeholder "Heap" visualization until the backend adds support.

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center opacity-60">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-text-muted flex items-center justify-center mb-3">
                <div className="w-2 h-2 bg-text-muted rounded-full animate-ping"></div>
            </div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Heap Empty</p>
            <p className="text-[10px] text-text-muted max-w-[200px]">
                Dynamic memory allocation (new/delete) is not yet executing in this code trace.
            </p>
        </div>
    );
}
