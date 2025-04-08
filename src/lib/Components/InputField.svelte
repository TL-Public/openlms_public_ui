<script>
	import { createEventDispatcher } from 'svelte';
	export let value = '';
	export let label = '';
	export let placeholder = '';
	export let name = '';
	export let required = '';
	export let type = '';
	export let readonly = '';
	export let labelFontWeight = 'font-medium';
	export let disabled = false;
	let despatch = createEventDispatcher();

	function handleInputValue(e) {
		value = e.target.value;
		despatch('handleInputData', { name, value });
	}
</script>

<div>
	<label for="input" class="block text-xs {labelFontWeight}  leading-6 text-gray-900">{label}</label
	>
	<div class="relative">
		<input
			{type}
			{name}
			id=" "
			class="block w-full rounded-md border-0 py-2 px-3 sm:py-1.5 sm:px-2 text-darkGray shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:placeholder:text-sm placeholder:text-xs outline-none focus:ring-2 focus:ring-inset focus:ring-primary sm:text-xs sm:leading-6"
			{placeholder}
			on:input={handleInputValue}
			{value}
			{required}
			{readonly}
			{disabled}
			{...$$restProps}
		/>
		<div class="absolute inset-y-0 right-3 flex items-center h-full pointer-events-auto">
			<slot></slot>
		</div>
	</div>
</div>
