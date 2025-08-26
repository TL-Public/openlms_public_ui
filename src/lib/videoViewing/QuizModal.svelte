<script>
	import { onMount, onDestroy } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import LineLoader from '$lib/Components/LineLoader.svelte';
	import Button from '$lib/Components/Button.svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import Portal from '$lib/Components/Portal.svelte';

	export let iframeUrl = '';
	let dispatch = createEventDispatcher();
	let errorMessage = '';
	let isSubmitting = false;
	let formObject = {};

	$: dataToSend = {};

	function handleSubmit() {}

	function handleOutsideClick() {
		// Prevents any action when clicking outside the modal
		return;
	}

	function handleCancel() {
		errorMessage = '';
		dispatch('handleCancelSubmission');
	}

	// 	onMount(() => {
	//     const iframe = document.getElementById('iframeForQuiz');
	//     if (iframe) {
	//       iframe.onload = function () {
	//         const data = {
	//           type: 'FROM_PARENT',
	//           message: 'Hello from Reap Admin!'
	//         };
	//         iframe.contentWindow.postMessage(data, 'http://localhost:5174/');
	//       };
	//     } else {
	//       console.error('Iframe not found!');
	//     }
	//   });

	// onMount(() => {
	// 	// Disable scrolling on the main page
	//     if(browser){

	//         document.body.style.overflow = 'hidden';
	//     }
	// });

	// onDestroy(() => {
	//     if(browser){

	//         // Re-enable scrolling when the modal is closed
	//         document.body.style.overflow = '';
	//     }
	// });
</script>

<!-- <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true"></div> -->
<Portal>
	<div
		class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
		aria-hidden="true"
		on:click|preventDefault
	></div>
	<div class="fixed inset-0 z-80 w-full overflow-y-auto flex items-center justify-center" id="form">
		<!-- <div class="flex min-h-full justify-center p-4 text-center items-start sm:p-0">
		</div> -->
		<div
			class="relative transform overflow-hidden rounded-lg bg-gray-10 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6"
			on:click|stopPropagation
		>
			<div class="pb-2">
				{#if isSubmitting}
					<LineLoader />
				{/if}
			</div>

			<iframe src={iframeUrl} class="w-full flex-1" style="border: none;" id="iframeForQuiz"
			></iframe>

			<div class="mt-5 sm:mt-4 flex gap-2 justify-end">
				<Button btnType="secondary" disabled={isSubmitting} on:click={handleCancel}>Cancel</Button>
			</div>
		</div>
	</div>
</Portal>
