import type { ArrayVisual } from '../../../../types';
import ArrayVisualizer from './ArrayVisualizer';
import './visualizers.css';

interface StringVisualizerProps {
    visual: ArrayVisual;
    className?: string;
    stepType?: any;
}

export default function StringVisualizer({ visual, className = '', stepType }: StringVisualizerProps) {
    // Custom header / subtitle for string visualization
    return (
        <div className={`string-visual-wrapper w-full flex flex-col items-center ${className}`}>
            <ArrayVisualizer 
                visual={{
                    ...visual,
                    // If target doesn't specify String, label it clearly
                    target: visual.target.toLowerCase().includes('str') || visual.target.toLowerCase().includes('s') 
                        ? visual.target 
                        : `${visual.target} (string)`
                }}
                stepType={stepType}
            />
        </div>
    );
}
