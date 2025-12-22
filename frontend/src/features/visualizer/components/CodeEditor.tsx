import { useRef, useEffect } from 'react';
import Editor, { type Monaco } from '@monaco-editor/react';
import { useExecutionStore } from '@/store/executionStore';

export default function CodeEditor() {
    const { code, setCode, traces, currentStepIndex } = useExecutionStore();
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<Monaco | null>(null);
    const decorationsRef = useRef<string[]>([]);

    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
    };

    useEffect(() => {
        if (!editorRef.current || !monacoRef.current) return;

        const currentTrace = traces[currentStepIndex];
        const line = currentTrace?.line;

        try {
            if (line && line > 0) {
                const model = editorRef.current.getModel();
                if (model && line <= model.getLineCount()) {
                    decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [
                        {
                            range: new monacoRef.current.Range(line, 1, line, 1),
                            options: {
                                isWholeLine: true,
                                className: 'bg-accent-cyan/20 border-l-4 border-accent-cyan shadow-[0_0_15px_rgba(42,195,222,0.1)]',
                                glyphMarginClassName: 'my-glyph-margin-class'
                            }
                        }
                    ]);
                    editorRef.current.revealLineInCenter(line);
                }
            } else {
                decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
            }
        } catch (e) {
            console.error("Monaco Decoration Error:", e);
        }
    }, [currentStepIndex, traces]);

    return (
        <div className="h-full w-full border-r border-gray-700">
            <Editor
                height="100%"
                defaultLanguage="cpp"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    readOnly: traces.length > 0, // Disable editing if we have execution traces
                    fontFamily: 'JetBrains Mono',
                    fontLigatures: true,
                }}
            />
        </div>
    );
}
