import { create } from 'zustand';

// Duplicate types locally or share via monorepo (simplified: duplicate)
export interface StackFrame {
    function: string;
    locals: Record<string, any>;
}

export interface ExecutionTrace {
    line: number;
    type: 'assignment' | 'comparison' | 'function_call' | 'return' | 'loop' | 'condition' | 'init' | 'definition';
    explanation: string;
    stack: StackFrame[];
    heap: Record<string, any>;
}

interface ExecutionState {
    code: string;
    traces: ExecutionTrace[];
    currentStepIndex: number;
    isPlaying: boolean;
    speed: number;
    isConnected: boolean;
    error: string | null;
    input: string;

    setCode: (code: string) => void;
    setInput: (input: string) => void;
    connect: () => void;
    runCode: () => void;
    nextStep: () => void;
    prevStep: () => void;
    setStep: (step: number) => void;
    togglePlay: () => void;
    setSpeed: (ms: number) => void;
    reset: () => void;
}

export const useExecutionStore = create<ExecutionState>((set, get) => {
    let ws: WebSocket | null = null;
    let intervalId: any = null;

    return {
        code: `int main() {
  int a = 5;
  int b = 10;
  int c = a + b;
  return c;
}`,
        traces: [],
        currentStepIndex: -1,
        isPlaying: false,
        speed: 500,
        isConnected: false,
        error: null,
        input: "",

        setCode: (code) => set({ code }),
        setInput: (input) => set({ input }),

        connect: () => {
            if (ws) return;
            ws = new WebSocket('ws://localhost:5000');

            ws.onopen = () => {
                set({ isConnected: true, error: null });
                console.log('Connected to Backend');
            };

            ws.onclose = () => {
                set({ isConnected: false });
                console.log('Disconnected');
            };

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === 'EXECUTION_RESULT') {
                    set({ traces: msg.payload, currentStepIndex: 0, isPlaying: true, error: null });
                    // Start playback immediately
                    if (intervalId) clearInterval(intervalId);
                    intervalId = setInterval(() => {
                        get().nextStep();
                    }, get().speed);
                } else if (msg.type === 'ERROR') {
                    set({ error: msg.payload, isPlaying: false });
                }
            };
        },

        runCode: () => {
            const { code, input, isConnected } = get();
            if (!isConnected || !ws) {
                set({ error: 'Not connected to server' });
                return;
            }
            set({ traces: [], currentStepIndex: -1, error: null });
            ws.send(JSON.stringify({ type: 'EXECUTE', payload: { code, input } }));
        },

        nextStep: () => {
            const { currentStepIndex, traces } = get();
            if (currentStepIndex < traces.length - 1) {
                set({ currentStepIndex: currentStepIndex + 1 });
            } else {
                set({ isPlaying: false });
                clearInterval(intervalId);
            }
        },

        prevStep: () => {
            const { currentStepIndex } = get();
            if (currentStepIndex > 0) {
                set({ currentStepIndex: currentStepIndex - 1 });
            }
        },

        setStep: (step) => set({ currentStepIndex: step }),

        togglePlay: () => {
            const { isPlaying, speed } = get();
            if (isPlaying) {
                clearInterval(intervalId);
                set({ isPlaying: false });
            } else {
                set({ isPlaying: true });
                intervalId = setInterval(() => {
                    get().nextStep();
                }, speed);
            }
        },

        setSpeed: (speed) => {
            set({ speed });
            const { isPlaying } = get();
            if (isPlaying) {
                clearInterval(intervalId);
                intervalId = setInterval(() => {
                    get().nextStep();
                }, speed);
            }
        },

        reset: () => {
            clearInterval(intervalId);
            set({ traces: [], currentStepIndex: -1, isPlaying: false, error: null });
        }
    };
});
