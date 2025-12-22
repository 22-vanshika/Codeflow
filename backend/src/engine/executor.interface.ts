import { ExecutionTrace } from '../types';

export interface IExecutor {
    execute(code: string, input: string): Generator<ExecutionTrace, void, unknown>;
}
