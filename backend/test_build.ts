import { AiService } from './src/services/ai.service';
import { CompilerService } from './src/services/compiler.service';
import { ExecutionController } from './src/controllers/execution.controller';

console.log("Verifying backend modules...");
try {
    const ai = new AiService();
    const compiler = new CompilerService();
    const controller = new ExecutionController();
    console.log("All services instantiated successfully.");
} catch (e: any) {
    console.error("Initialization Failed:", e);
    process.exit(1);
}
