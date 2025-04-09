<script>
	import { createEventDispatcher, onMount } from 'svelte';
	export let tabs;
	export let activeTabText = tabs?.[0].text ?? '';

	const despatch = createEventDispatcher();

	function handleTab(text) {
		activeTabText = text;
		despatch('handleActiveTab', activeTabText);
	}
</script>

<div class="border-b border-gray-100 w-full">
	<nav class="flex flex-row flex-wrap">
		{#each tabs as tab}
			<button
				on:click={() => handleTab(tab?.text)}
				class=" whitespace-nowrap cursor-pointer border-b-2 px-4 py-3 text-sm text-darkGray hover:border-blue-100 hover:text-gray-700 {tab?.text ===
				activeTabText
					? 'border-secondary font-semibold hover:border-secondary'
					: 'border-transparent'}"
			>
				<div class="flex items-center space-x-2">
					{#if tab?.icon}
						<img src={tab?.icon} alt="icon of {tab?.textDisplay}" class="h-5 w-5 lg:h-6 lg:w-6" />
					{/if}
					<span>{tab?.textDisplay}</span>
				</div></button
			>
		{/each}
	</nav>
</div>
