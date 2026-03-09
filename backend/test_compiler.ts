import { CompilerService } from './src/services/compiler.service';

const compiler = new CompilerService();
compiler.execute('cpp', '#include <iostream>\nint main() { std::cout << "Hello local compiler!" << std::endl; return 0; }', '').then(console.log).catch(console.error);
