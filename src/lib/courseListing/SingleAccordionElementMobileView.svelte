<script>
	import { createEventDispatcher, onMount } from 'svelte';
	export let sideBarItem;
	export let border;
	export let fontWeight;
	export let index;
	export let expanded = false;

	let dispatch = createEventDispatcher();
	let accordionElement = null;
	let mounted = false;

	function handleClick(e) {
		dispatch('handleAccordionClick', sideBarItem);
	}
</script>

<div class=" space-y-6 divide-y divide-gray-900/10" role="button">
	<div class="pb-2 transition-all duration-300 ease-in-out">
		<dt
			class="border-gray100 border-2 px-2 py-2 rounded-lg"
			class:bg-blue-10={expanded}
			class:bg-white={!expanded}
			class:border-none={border === 'border-none'}
		>
			<!-- Expand/collapse question button -->

			<button
				on:click={(e) => handleClick(e)}
				on:keydown={(e) => handleClick(e)}
				type="button"
				class="outerAccordion flex w-full items-start justify-between text-left text-gray-900 px-2 sm:px-3"
				aria-controls="accordion-{index}"
				aria-expanded={expanded}
				tabindex={sideBarItem?.id}
			>
				<span
					class="outerAccordion leading-7 text-darkGray text-sm sm:text-base capitalize"
					class:font-medium={fontWeight === 'font-medium'}>{sideBarItem?.name}</span
				>
				<span class="ml-6 flex h-6 items-center">
					{#if expanded}
						<!--
              Item expanded.
            -->

						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="outerAccordion size-4 text-accent"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
						</svg>
					{:else}
						<!--
              Icon when question is collapsed
            -->

						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="outerAccordion size-4 text-accent"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
						</svg>
					{/if}
				</span>
			</button>
		</dt>
		{#if expanded}
			<dd class="mb-2" id="faq-0">
				<slot></slot>
			</dd>
		{/if}
	</div>
</div>
