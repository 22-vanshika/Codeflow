import type { TeacherNote, PatternInfo } from '../../../../types';
import './visualizers.css';

interface TeacherNoteCardProps {
    note: TeacherNote;
    pattern?: PatternInfo;
    step: number;
    totalSteps: number;
}

export default function TeacherNoteCard({ note, pattern, step, totalSteps }: TeacherNoteCardProps) {
    return (
        <div className="teacher-note-card">
            {/* Header */}
            <div className="teacher-note-header">
                <div className="teacher-note-icon">
                    📚
                </div>
                <div className="teacher-note-title">
                    Step {step} of {totalSteps}
                </div>
                {pattern && (
                    <div
                        className="pattern-badge"
                        style={{ backgroundColor: pattern.color + '20', color: pattern.color }}
                    >
                        <span className="pattern-badge-icon">
                            {getPatternIcon(pattern.name)}
                        </span>
                        {pattern.name}
                    </div>
                )}
            </div>

            {/* What happened */}
            <div className="teacher-note-section">
                <div className="teacher-note-label what">
                    💡 What happened
                </div>
                <div className="teacher-note-text">
                    {note.what}
                </div>
            </div>

            {/* Why it matters */}
            <div className="teacher-note-section">
                <div className="teacher-note-label why">
                    🎯 Why it matters
                </div>
                <div className="teacher-note-text">
                    {note.why}
                </div>
            </div>

            {/* What's next */}
            <div className="teacher-note-section">
                <div className="teacher-note-label next">
                    ➡️ Next step
                </div>
                <div className="teacher-note-text">
                    {note.next}
                </div>
            </div>
        </div>
    );
}

function getPatternIcon(patternName: string): string {
    switch (patternName.toLowerCase()) {
        case 'two-pointer':
            return '👉👈';
        case 'sliding window':
            return '🪟';
        case 'binary search':
            return '🔍';
        case 'recursion':
            return '🔄';
        case 'linear traversal':
            return '➡️';
        case 'divide & conquer':
            return '✂️';
        default:
            return '📊';
    }
}
