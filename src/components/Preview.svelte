<script>
    import { preview } from '../lib/store';
</script>

<div class="h-full overflow-auto">
    <iframe
        title="preview"
        srcdoc={$preview}
        sandbox="allow-same-origin allow-scripts allow-modals"
        scrolling="yes"
        class="w-full h-full border-0"
    ></iframe>
</div>
