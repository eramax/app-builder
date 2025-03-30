<script>
    import { files, activeFile } from "../lib/store";
    import { onMount } from "svelte";
    import loader from "@monaco-editor/loader";

    let editorContainer;
    let editor;
    let monaco;

    function getLanguageFromFilename(filename) {
        const extension = filename.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'js': return 'javascript';
            case 'css': return 'css';
            case 'json': return 'json';
            case 'md': return 'markdown';
            case 'ts': return 'typescript';
            case 'jsx': return 'javascript';
            case 'tsx': return 'typescript';
            case 'html': return 'html';
            default: return 'html';
        }
    }

    function getEditorConfig(content, filename) {
        return {
            value: content,
            language: getLanguageFromFilename(filename),
            theme: "vs-dark",
            automaticLayout: true,
            minimap: { enabled: true },
            lineNumbers: "on",
            formatOnPaste: true,
            formatOnType: true,
            scrollBeyondLastLine: false,
        };
    }

    function initializeEditor(content) {
        if (!editorContainer || !monaco) return;
        editor = monaco.editor.create(
            editorContainer,
            getEditorConfig(content, $activeFile),
        );

        // Event listener for content changes
        editor.onDidChangeModelContent(() => {
            const newValue = editor.getValue();
            if ($files[$activeFile] !== newValue) {
                const position = editor.getPosition();
                $files[$activeFile] = newValue;
                if (position) editor.setPosition(position);
            }
        });
    }

    onMount(async () => {
        try {
            monaco = await loader.init();
            console.log("Monaco Editor loaded");

            initializeEditor($files[$activeFile]);
        } catch (error) {
            console.error("Failed to load Monaco editor:", error);
        }

        // Proper cleanup
        return () => {
            if (editor) {
                editor.dispose();
                editor = null;
            }
        };
    });

    $effect(() => {
        const currentFile = $activeFile;
        const fileContent = $files[currentFile];

        if (editor && fileContent !== editor.getValue()) {
            // Update editor content
            editor.setValue(fileContent);
            
            // Update language mode if file changed
            const model = editor.getModel();
            if (model) {
                monaco.editor.setModelLanguage(model, getLanguageFromFilename(currentFile));
            }
        }
    });
</script>

<div class="flex-1 bg-app-darker">
    <div bind:this={editorContainer} class="w-full h-full"></div>
</div>
