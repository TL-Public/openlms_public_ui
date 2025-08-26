<script>
    import NotFound  from '$lib/svgComponents/NotFound.svelte';
    export let errorMessage = "Not Found";
    export let theme = "normal"; // 'normal' or 'light'
</script>
<div class="flex flex-col items-center p-6 sm:gap-8 gap-4">
    <NotFound addClass="w-1/2 sm:w-1/3 h-auto" {theme} />
    <h2 class="text-base sm:text-xl font-bold {theme === 'light' ? 'text-white50' : 'text-primary'}">{errorMessage}</h2>
</div>