import './visualizers.css';

interface MatrixVisualizerProps {
    visual: {
        type: 'matrix';
        target: string;
        rows: number;
        cols: number;
        values: any[][];
        rowPointers: Record<string, number>;
        colPointers: Record<string, number>;
    };
    className?: string;
}

export default function MatrixVisualizer({ visual, className = '' }: MatrixVisualizerProps) {
    const { target, values, rowPointers, colPointers } = visual;
    const numRows = values.length;
    const numCols = values[0]?.length || 0;

    // Determine if any pointers point to this cell
    const getCellPointers = (r: number, c: number) => {
        const ptrs: string[] = [];
        const rowKeys = Object.keys(rowPointers);
        const colKeys = Object.keys(colPointers);

        for (const rk of rowKeys) {
            for (const ck of colKeys) {
                // Common row/col variable pairs: (i,j), (r,c), (row,col), (x,y)
                const isPair = (rk === 'i' && ck === 'j') || 
                               (rk === 'r' && ck === 'c') || 
                               (rk === 'row' && ck === 'col') || 
                               (rk === 'x' && ck === 'y');
                if (isPair && rowPointers[rk] === r && colPointers[ck] === c) {
                    ptrs.push(`${rk},${ck}`);
                }
            }
        }
        return ptrs;
    };

    return (
        <div className={`matrix-visualizer flex flex-col items-center justify-center p-4 ${className}`}>
            <div className="av-label mb-4">
                <span className="av-label-text">{target}</span>
                <span className="av-count-badge">{numRows} × {numCols} grid</span>
            </div>

            <div className="flex flex-col gap-1 border border-border-subtle p-2 rounded-xl bg-bg-panel/40 shadow-lg">
                {values.map((row, rIndex) => (
                    <div key={rIndex} className="flex gap-1">
                        {row.map((val, cIndex) => {
                            const ptrs = getCellPointers(rIndex, cIndex);
                            const isPointed = ptrs.length > 0;
                            const displayVal = typeof val === 'boolean' ? (val ? 'T' : 'F') : String(val);

                            return (
                                <div 
                                    key={cIndex}
                                    className={`
                                        w-10 h-10 rounded-lg flex flex-col items-center justify-center font-mono text-sm border font-bold relative transition-all duration-300
                                        ${isPointed 
                                            ? 'border-accent-orange bg-accent-orange/20 text-accent-orange shadow-md scale-105 z-10' 
                                            : val === 1 || val === true || String(val) === '#' || String(val).toLowerCase() === 'x'
                                                ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan'
                                                : 'border-border-subtle bg-bg-main text-text-primary'
                                        }
                                    `}
                                    title={`[${rIndex}][${cIndex}] = ${val}`}
                                >
                                    <span>{displayVal}</span>
                                    {isPointed && (
                                        <div className="absolute -top-3 bg-accent-orange text-[#0B1120] text-[8px] px-1 rounded font-extrabold select-none shadow">
                                            {ptrs.join(' ')}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
