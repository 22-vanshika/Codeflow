# C++ Code Execution Visualizer

A web-based interactive code execution visualizer that performs a fully animated dry run of C++ code.
Built with React, TypeScript, Node.js, and a custom C++ Interpreter.

## Features
- **Code Editor**: Monaco Editor (VS Code like).
- **Visualization**: Animated execution trace, Stack visualization, Local variables.
- **Controls**: Run, Pause, Step-by-Step, Speed Control.
- **Backend Interpreter**: Custom TypeScript-based C++ AST interpreter for safe and deterministic execution.

## Supported C++ Subset
- Variables (`int`, `string`, `bool`)
- Arithmetic & Logic (`+`, `-`, `*`, `/`, `==`, `<`, `>`)
- Control Flow (`if`, `else`, `while`, `return`)
- Functions & Recursion
- Block Scoping

## Setup & Run

### Prerequisites
- Node.js (v16+)
- npm

### 1. Backend
Navigate to `backend` and start the server:
```bash
cd backend
npm install
npm run start
# Server runs on http://localhost:3000 (WebSocket on same port)
```

### 2. Frontend
Navigate to `frontend` and start the dev server:
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## Architecture
- **Backend**: Node.js + Express + WebSocket.
    - `src/languages/cpp/parser.ts`: Recursive descent parser generating JSON AST.
    - `src/languages/cpp/executor.ts`: AST Walker generating `ExecutionTrace` steps.
    - `src/ws/server.ts`: Handles execution requests.
- **Frontend**: React + Vite + Tailwind.
    - `store/executionStore.ts`: Zustand store managing WebSocket and playback.
    - `visualizer/`: Components for rendering the Stack and Trace log.
