<script>
    import { files, activeFile } from "../lib/store";
    import { onMount } from "svelte";
    import loader from "@monaco-editor/loader";

    let editorContainer;
    let editor;

    $effect(() => {
        if (editor && $files[$activeFile] !== editor.getValue()) {
            editor.setValue($files[$activeFile]);
        }
    });

    onMount(async () => {
        const monaco = await loader.init();
        console.log("Monaco Editor loaded", monaco);
        monaco.languages.html.htmlDefaults.setOptions({
            format: {
                tabSize: 2,
                insertSpaces: true,
                wrapAttributes: "auto",
                wrapAttributesIndentSize: 2,
            },
        });
        editor = monaco.editor.create(editorContainer, {
            value: $files[$activeFile],
            language: "html",
            theme: "vs-dark",
            automaticLayout: true,
            minimap: { enabled: true },
            lineNumbers: "on",
            formatOnPaste: true,
            formatOnType: true,
            scrollBeyondLastLine: false,
        });

        editor.onDidChangeModelContent(() => {
            const newValue = editor.getValue();
            if ($files[$activeFile] !== newValue) {
                $files[$activeFile] = newValue;
            }
        });

        return () => editor?.dispose();
    });
</script>

<div class="flex-1 bg-app-darker">
    <div bind:this={editorContainer} class="w-full h-full" />
</div>
