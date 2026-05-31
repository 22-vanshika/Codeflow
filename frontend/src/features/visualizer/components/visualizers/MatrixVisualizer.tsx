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
        lastAccessedCell?: { r: number; c: number } | null;
        visitedCells?: { r: number; c: number }[];
        binarySearchRange?: { l: number; r: number } | null;
    };
    className?: string;
}

export default function MatrixVisualizer({ visual, className = '' }: MatrixVisualizerProps) {
    const { target, values, rowPointers, colPointers, lastAccessedCell, visitedCells = [], binarySearchRange } = visual;
    const numRows = values.length;
    const numCols = values[0]?.length || 0;

    // Determine if any pointers point to this cell
    const getCellPointers = (r: number, c: number) => {
        const ptrs: string[] = [];
        const rowKeys = Object.keys(rowPointers);
        const colKeys = Object.keys(colPointers);

        for (const rk of rowKeys) {
            for (const ck of colKeys) {
                const cleanR = rk.replace('_row', '').replace('Row', '');
                const cleanC = ck.replace('_col', '').replace('Col', '');
                const isPair = (cleanR === cleanC) || 
                               (rk === 'i' && ck === 'j') || 
                               (rk === 'r' && ck === 'c') || 
                               (rk === 'row' && ck === 'col') || 
                               (rk === 'x' && ck === 'y');
                if (isPair && rowPointers[rk] === r && colPointers[ck] === c) {
                    ptrs.push(cleanR === cleanC ? cleanR.toUpperCase() : `${rk},${ck}`);
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

                            const index1D = rIndex * numCols + cIndex;
                            const inSearchRange = !binarySearchRange || (index1D >= binarySearchRange.l && index1D <= binarySearchRange.r);
                            const isActiveCell = !!(lastAccessedCell && lastAccessedCell.r === rIndex && lastAccessedCell.c === cIndex);
                            const isVisited = visitedCells.some(cell => cell.r === rIndex && cell.c === cIndex);

                            // Determine CSS classes dynamically
                            let cellClass = '';
                            if (isActiveCell) {
                                cellClass = 'border-accent-orange bg-accent-orange/35 text-accent-orange shadow-xl scale-110 z-20 ring-2 ring-accent-orange/50 animate-pulse font-extrabold';
                            } else if (isPointed) {
                                cellClass = 'border-accent-orange bg-accent-orange/20 text-accent-orange shadow-md scale-105 z-10';
                            } else if (isVisited) {
                                cellClass = 'border-accent-cyan/60 bg-accent-cyan/15 text-accent-cyan';
                            } else if (val === 1 || val === true || String(val) === '#' || String(val).toLowerCase() === 'x') {
                                cellClass = 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan';
                            } else {
                                cellClass = 'border-border-subtle bg-bg-main text-text-primary';
                            }

                            // Apply dimming if out of active binary search range
                            if (!inSearchRange) {
                                cellClass += ' opacity-20 border-dashed scale-95';
                            }

                            return (
                                <div 
                                    key={cIndex}
                                    className={`
                                        w-10 h-10 rounded-lg flex flex-col items-center justify-center font-mono text-sm border font-bold relative transition-all duration-300
                                        ${cellClass}
                                    `}
                                    data-array-name={target}
                                    data-cell-index={index1D}
                                    data-row-index={rIndex}
                                    data-col-index={cIndex}
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
