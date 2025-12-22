import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useExecutionStore } from '../../../store/executionStore';
import Button from '@/components/common/Button';

export default function ExecutionControls() {
    const { togglePlay, isPlaying, nextStep, prevStep, currentStepIndex, traces } = useExecutionStore();

    return (
        <>
            <Button onClick={prevStep} disabled={currentStepIndex <= 0}>
                <SkipBack size={18} />
            </Button>
            <Button
                onClick={togglePlay}
                isActive={isPlaying}
                className={isPlaying ? 'text-accent-cyan ring-1 ring-accent-cyan/50' : ''}
            >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </Button>
            <Button onClick={nextStep} disabled={currentStepIndex >= traces.length - 1}>
                <SkipForward size={18} />
            </Button>
        </>
    );
}
