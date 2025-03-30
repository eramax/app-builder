<script>
    import { files, activeFile } from "../lib/store";
    import { onMount } from "svelte";
    import loader from "@monaco-editor/loader";

    let editorContainer;
    let editor;

    const getLang = (filename) => {
        const ext = filename.split(".").pop()?.toLowerCase();
        return (
            {
                js: "javascript",
                jsx: "javascript",
                ts: "typescript",
                tsx: "typescript",
                css: "css",
                json: "json",
                md: "markdown",
                html: "html",
            }[ext] || "html"
        );
    };

    onMount(async () => {
        try {
            const monaco = await loader.init();
            editor = monaco.editor.create(editorContainer, {
                value: $files[$activeFile],
                language: getLang($activeFile),
                theme: "vs-dark",
                automaticLayout: true,
                minimap: { enabled: true },
            });

            editor.onDidChangeModelContent(() => {
                const newValue = editor.getValue();
                if ($files[$activeFile] !== newValue) {
                    $files[$activeFile] = newValue;
                }
            });
        } catch (error) {
            console.error("Failed to load Monaco editor:", error);
        }

        return () => editor?.dispose();
    });
    $effect(() => {
        const content = $files[$activeFile];
        if (editor && content !== editor.getValue()) {
            editor.setValue(content);
            monaco.editor.setModelLanguage(
                editor.getModel(),
                getLang($activeFile),
            );
        }
    });
</script>

<div class="flex-1 bg-app-darker">
    <div bind:this={editorContainer} class="w-full h-full"></div>
</div>
