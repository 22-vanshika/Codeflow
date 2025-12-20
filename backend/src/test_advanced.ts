import { Executor } from './languages/cpp/executor';

const code = `
class Point {
    public:
    int x;
    int y;
};

int main() {
    std::cout << "Starting Test" << std::endl;

    // 1. Vector Test
    std::vector<int> v;
    v.push_back(10);
    v.push_back(20);
    int head = v[0];
    std::cout << "Vector head: " << head << std::endl;
    v[1] = 30;
    std::cout << "Vector[1]: " << v[1] << std::endl;

    // 2. Class & Pointer Test
    Point* p = new Point();
    p->x = 100;
    p->y = 200;
    std::cout << "Point: " << p->x << ", " << p->y << std::endl;
    
    // 3. Stack Object (Partial support via struct-like behavior if we had it, but for now assuming heap for new)
    
    return 0;
}
`;

try {
    console.log('--- Executing Advanced C++ Code ---');
    const executor = new Executor();
    let steps = 0;
    for (const trace of executor.execute(code)) {
        steps++;
        // console.log(`Step ${steps}: Line ${trace.line} [${trace.type}] ${trace.explanation}`);
        if (trace.type === 'function_call' && trace.explanation.startsWith('Output:')) {
            console.log(trace.explanation);
        }
        if (trace.heap && Object.keys(trace.heap).length > 0) {
            // console.log("Heap:", JSON.stringify(trace.heap));
        }
    }
    console.log("Execution finished successfully.");
} catch (e) {
    console.error("Execution Failed:");
    console.error(e);
}
