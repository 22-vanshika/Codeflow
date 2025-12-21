import { ExecutionTrace } from '../types';

export interface LanguageExecutor {
    execute(code: string, input: string): Generator<ExecutionTrace>;
}
