<script>
    import { siteStore } from "$lib/store.svelte";
    import Editor from "$components/Editor.svelte";
    import Preview from "$components/Preview.svelte";
    import Prompt from "$components/Prompt.svelte";
    import Navigation from "$components/Navigation.svelte";
    import { onMount } from "svelte";
  
    onMount(() => {
      siteStore.loadDemoFiles();
    });
  </script>
  
  <div class="h-screen flex flex-col">
    <div class="grid grid-cols-2 gap-4 flex-grow h-full p-4">
      <div class="flex flex-col gap-4 h-full">
        <Prompt />
        <div class="bg-[#1e1e1e] rounded-lg flex flex-col flex-grow overflow-hidden">
          <Navigation />
          <Editor />
        </div>
      </div>
      <div class="bg-white rounded-lg overflow-hidden">
        <Preview />
      </div>
    </div>
  </div>