<script>
    import { files } from '../lib/store';
</script>

<div class="h-full overflow-auto">
    <iframe
        title="preview"
        srcdoc={$files['index.html']}
        sandbox="allow-same-origin allow-scripts allow-modals"
        scrolling="yes"
        class="w-full h-full border-0"
    ></iframe>
</div>
