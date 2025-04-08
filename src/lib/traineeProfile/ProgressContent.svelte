<script>
	import { _ } from 'svelte-i18n';
	import ErrorComponent from '$lib/Components/ErrorComponent.svelte';
    </script>

<div class="bg-white p-4 rounded-lg text-center">
    <ErrorComponent errorMessage={$_('Progress details are currently unavailable.')} />
</div>