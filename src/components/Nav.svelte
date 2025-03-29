<script>
    async function deployToVercel() {
        alert("Deployment to Vercel initiated!");
    }
</script>

<nav
    class="bg-app-dark p-4 border-b border-gray-800 flex justify-between items-center"
>
    <div class="flex items-center space-x-2">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            ></path>
        </svg>
        <span class="font-bold">App-Builder</span>
    </div>

    <div class="flex space-x-2">
        <button class="bg-app-gray px-3 py-1 rounded-md text-sm">New</button>
        <span class="text-gray-400">Imagine and Build</span>
    </div>

    <button
        class="bg-pink-500 hover:bg-pink-600 px-4 py-1 rounded-md text-white font-medium"
        onclick={deployToVercel}
    >
        Deploy to Vercel
    </button>
</nav>
